import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stripe Client Lazy Initialization
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Contact Us
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: "nglblackgarlic@gmail.com",
        subject: subject || "New Contact Message",
        text: message,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`,
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      console.error("Contact Error:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  });

  // API: Notify Me
  app.post("/api/notify-me", async (req, res) => {
    try {
      const { name, email, productName, abGroup } = req.body;
      const scriptUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;
      
      console.log("Notify Me request received. URL configured:", !!scriptUrl);
      
      if (!scriptUrl) {
        console.error("GOOGLE_SHEET_WEB_APP_URL is not configured.");
        return res.status(500).json({ error: "Service configuration error. Please contact support." });
      }

      console.log("Sending request to Google Sheet...");
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, productName, abGroup, timestamp: new Date().toISOString() }),
      });

      console.log("Google Sheet response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Sheet error response:", errorText);
        return res.status(500).json({ error: "Failed to save your information. Please try again later." });
      }

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      console.error("Notify Me Error:", error);
      res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
  });

  // API: Create Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { priceId, productName, amount } = req.body;

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: productName,
              },
              unit_amount: amount, // in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/?success=true`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
