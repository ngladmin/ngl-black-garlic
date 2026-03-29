/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Menu, X, CheckCircle2, Info, Leaf, Timer, Shield, FlaskConical, Wind, BatteryCharging } from 'lucide-react';
import ReactGA from 'react-ga4';
import { cn } from './lib/utils';
import { NotifyMeModal } from './components/NotifyMeModal';
import { LegalModal } from './components/LegalModal';
import { ContactModal } from './components/ContactModal';
import { CookieBanner } from './components/CookieBanner';
import { getABGroup, ABGroup } from './lib/abTest';

const PRODUCTS = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    description: 'A beautiful anodised aluminium jar along with 100gm of unpeeled black garlic cloves. Designed for lifelong reuse.',
    price: 5499, // in cents
    image: '/BG_Container_w_garlic.jpg',
    tag: 'Forever Vessel'
  },
  {
    id: 'refill',
    name: 'Refill Pack',
    description: '100gm of unpeeled cloves, packaged in an eco-friendly, home-compostable pouch. Minimal waste, maximum flavour.',
    price: 3099,
    image: '/bg_pouch.jpg',
    tag: 'Home Compostable'
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [legalTitle, setLegalTitle] = useState('');
  const [legalContent, setLegalContent] = useState<React.ReactNode>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [abGroup, setAbGroup] = useState<ABGroup>('A');
  const [loading, setLoading] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const openLegal = (title: string, content: React.ReactNode) => {
    setLegalTitle(title);
    setLegalContent(content);
    setIsLegalModalOpen(true);
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      // Specifically target GA cookies if we want to be less aggressive, 
      // but clearing all is fine since we don't use others.
      // However, let's just do it once on the actual decline action.
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  const initGA = () => {
    const measurementId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      ReactGA.initialize(measurementId);
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      initGA();
    }
    // Removed the 'else if (consent === "declined") clearCookies()' 
    // to be less aggressive on every page load.
    
    setAbGroup(getABGroup());

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyNow = (productName: string) => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      ReactGA.event({
        category: 'Shop',
        action: 'Click Buy Now',
        label: productName,
      });
    }
    setSelectedProduct(productName);
    setIsNotifyModalOpen(true);
  };

  return (
    <div className="min-h-screen selection:bg-gold selection:text-ink">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        scrolled ? "bg-paper/90 backdrop-blur-md border-b border-ink/10" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-serif font-bold tracking-tighter text-gold hover:text-gold/80 transition-colors"
            >
              ngl black garlic
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
            <a href="#about" className="hover:text-gold transition-colors">What is it?</a>
            <a href="#science" className="hover:text-gold transition-colors">The Science</a>
            <a href="#shop" className="hover:text-gold transition-colors">Shop</a>
            <a href="#vision" className="hover:text-gold transition-colors">Vision</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-paper pt-24 px-6 flex flex-col gap-8 text-2xl font-serif"
          >
            <a href="#about" onClick={() => setIsMenuOpen(false)}>What is it?</a>
            <a href="#science" onClick={() => setIsMenuOpen(false)}>The Science</a>
            <a href="#shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
            <a href="#vision" onClick={() => setIsMenuOpen(false)}>Vision</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=2000&auto=format&fit=crop" 
            alt="Black Garlic Background" 
            className="w-full h-full object-cover opacity-10 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-6 block">Artisanal Excellence</span>
            <h1 className="text-6xl md:text-9xl font-serif mb-8 leading-[0.9] tracking-tighter">
              The Dark <br /> <span className="italic text-gold">Alchemy</span>
            </h1>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Discover the profound depth of fermented black garlic. A healthy, culinary treasure redefined for the modern palate.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="#shop" 
                className="px-10 py-4 bg-gold text-paper font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all duration-300 flex items-center gap-2 group"
              >
                Shop Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#about" 
                className="px-10 py-4 border border-ink/20 hover:border-gold transition-colors uppercase tracking-widest text-sm font-medium"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Black Garlic */}
      <section id="about" className="py-16 md:py-16 px-6 bg-paper text-ink">
        <div className="max-w-7xl mx-auto grid md:grid-template-columns: 1fr 1fr gap-20 items-center">
          <div className="relative">
            <div className="aspect-[3/1.4] bg-ink/5 rounded-2xl overflow-hidden">
              <img 
                src="/black-garlic.jpg" 
                alt="Black Garlic Detail" 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold rounded-full flex items-center justify-center text-ink p-8 text-center rotate-12 hidden lg:flex">
              <p className="font-serif italic text-xl">"A flavour profile unlike anything else in nature."</p>
            </div>
          </div>
          
          <div>
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">What is it?</span>
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">Nature's Sweet <br />Umami Secret</h2>
            <div className="space-y-6 text-lg text-ink/70 leading-relaxed font-light">
              <p>
                Black garlic is not a different species of garlic. It is the result of a meticulous, slow-fermentation process of regular white garlic under controlled heat and humidity.
              </p>
              <p>
                The result? The sharp, pungent bite of raw garlic transforms into a soft, jelly-like texture with a complex flavour profile reminiscent of balsamic vinegar, molasses, and tamarind.
              </p>
              <ul className="grid grid-cols-1 gap-4 pt-6">
                {[
                  { icon: <Shield className="text-gold" size={20} />, text: "Twice the antioxidants of regular garlic" },
                  { icon: <FlaskConical className="text-gold" size={20} />, text: "Rich in S-Allylcysteine (SAC)" },
                  { icon: <Wind className="text-gold" size={20} />, text: "No 'garlic breath' after consumption" },
                  { icon: <BatteryCharging className="text-gold" size={20} />, text: "Natural energy and immunity booster" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-ink">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section id="science" className="py-8 md:py-16 px-6 bg-gray-50 border-y border-ink/5">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-20">
          <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">The Science</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Nature's Potent Alchemy</h2>
          <p className="text-ink/60 text-lg font-light mb-8">
            We translate complex science into meaningful health outcomes, so you don't have to worry about the details - just enjoy the taste and the benefits.
          </p>
          <button 
            onClick={() => openLegal('Deep Dive into the Science', (
              <div className="space-y-6 text-sm leading-relaxed text-left">
                <p>Black garlic undergoes a Maillard reaction that converts raw garlic's harsh compounds into potent, highly bioavailable antioxidants like S-allylcysteine (SAC). Below is a curated selection of peer-reviewed research highlighting its proven health benefits:</p>
                
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-ink mb-1">Comprehensive Review of Bioactivity</h4>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/28911544/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline block font-medium">Black garlic: A critical review of its production, bioactivity, and application (2017)</a>
                    <p className="text-ink/60 text-xs mt-1">Details the transformation of compounds during fermentation and summarizes broad therapeutic effects.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-ink mb-1">Antioxidant & Physicochemical Properties</h4>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/25335109/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline block font-medium">Physicochemical and antioxidant properties of black garlic (2014)</a>
                    <p className="text-ink/60 text-xs mt-1">Demonstrates how the aging process significantly increases the antioxidant capacity of black garlic compared to raw garlic.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink mb-1">Cardiovascular Health & Lipid Metabolism</h4>
                    <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4317477/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline block font-medium">The effects of black garlic (Allium satvium) extracts on lipid metabolism in rats fed a high fat diet (2015)</a>
                    <p className="text-ink/60 text-xs mt-1">Shows improved lipid profiles and cardiovascular protection in animal models.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink mb-1">Liver Protection (Hepatoprotective)</h4>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/24795800/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline block font-medium">Hepatoprotective effect of aged black garlic extract in rodents (2014)</a>
                    <p className="text-ink/60 text-xs mt-1">Highlights the ability of black garlic to protect liver cells from oxidative damage.</p>
                  </div>
                </div>
                
                <p className="text-xs text-ink/50 italic mt-6 border-t border-ink/10 pt-4">Note: These links direct to the National Center for Biotechnology Information (NCBI) and PubMed databases. This information is for educational purposes and not intended as medical advice.</p>
              </div>
            ))}
            className="text-gold font-bold uppercase tracking-widest text-sm border-b border-gold hover:text-ink hover:border-ink transition-colors"
          >
            Deep dive into the science
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="p-4 font-serif text-xl">Attribute</th>
                  <th className="p-4 font-serif text-xl">White Garlic</th>
                  <th className="p-4 font-serif text-xl text-gold">Black Garlic</th>
                </tr>
              </thead>
              <tbody className="text-ink/70">
                <tr className="border-b border-ink/5">
                  <td className="p-4">Antioxidant Level</td>
                  <td className="p-4">Moderate</td>
                  <td className="p-4 text-gold font-bold">Very High</td>
                </tr>
                <tr className="border-b border-ink/5">
                  <td className="p-4">Flavour Profile</td>
                  <td className="p-4">Pungent, Sharp</td>
                  <td className="p-4 text-gold font-bold">Sweet, Umami</td>
                </tr>
                <tr className="border-b border-ink/5">
                  <td className="p-4">Digestibility</td>
                  <td className="p-4">Can cause irritation</td>
                  <td className="p-4 text-gold font-bold">Gentle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-8 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 md:mb-20">
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">The Collection</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Artisanal Selection</h2>
            <p className="text-ink/50 max-w-md">
              Small batch production. Hand-selected for quality. Sustainable by design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group bg-white border border-ink/5 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-gold text-paper px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                    {product.tag}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif">{product.name}</h3>
                    <span className="text-gold font-serif text-xl">${(product.price / 100).toFixed(2)}</span>
                  </div>
                  <p className="text-ink/50 text-sm mb-8 font-light leading-relaxed flex-grow">
                    {product.description}
                  </p>
                  <button 
                    onClick={() => handleBuyNow(product.name)}
                    className="w-full py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-paper transition-all duration-300 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <>Buy Now <ShoppingBag size={14} /></>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NotifyMeModal 
        isOpen={isNotifyModalOpen} 
        onClose={() => {
          setIsNotifyModalOpen(false);
          setSelectedProduct(null);
        }} 
        productName={selectedProduct}
        abGroup={abGroup}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        title={legalTitle}
        content={legalContent}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CookieBanner 
        onAccept={initGA}
        onDecline={clearCookies}
      />

      {/* Vision Section */}
      <section id="vision" className="py-8 md:py-16 px-6 bg-gold text-ink overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <span className="text-[20vw] font-serif font-bold leading-none select-none">VISION</span>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="uppercase tracking-widest text-xs font-bold mb-6 block opacity-60">Vision</span>
          <h2 className="text-5xl md:text-8xl font-serif mb-12 leading-[0.9] tracking-tighter">
            Luxury made <br /> <span className="italic">Accessible.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 text-lg leading-relaxed">
            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-sm">Our Vision</h4>
              <p>
                At ngl foods, we believe that premium artisanal ingredients shouldn't be reserved for elite kitchens. Our vision is to make the profound health benefits and culinary depth of black garlic affordable and easy to access for every home cook.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-sm">Our Mission</h4>
              <p>
                We bridge the gap between ancient fermentation traditions and modern convenience. By optimising our small-batch process and using sustainable, reusable packaging, we deliver the highest quality black garlic directly to your door, sourced locally from Australian farmers, without the luxury markup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-ink/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <span className="text-3xl font-serif font-bold tracking-tighter text-gold mb-6 block">ngl black garlic</span>
            <p className="text-ink/40 text-sm leading-relaxed mb-8">
              Premium artisanal black garlic, fermented for at least 30 days to reach peak umami. Organic, sustainable, and delivered in eco-friendly packaging, sourced locally from Australian farmers.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/nglblackgarlic" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest hover:text-gold transition-colors">Instagram</a>
              <a href="#" className="text-xs uppercase tracking-widest hover:text-gold transition-colors">Twitter</a>
              <a href="#" className="text-xs uppercase tracking-widest hover:text-gold transition-colors">Facebook</a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h5 className="text-xs uppercase tracking-widest font-bold mb-6 text-gold">Explore</h5>
              <ul className="space-y-4 text-sm text-ink/60">
                <li><a href="#about" className="hover:text-ink transition-colors">The Product</a></li>
                <li><a href="#science" className="hover:text-ink transition-colors">The Science</a></li>
                <li><a href="#shop" className="hover:text-ink transition-colors">Shop</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest font-bold mb-6 text-gold">Support</h5>
              <ul className="space-y-4 text-sm text-ink/60">
                <li>
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="hover:text-ink transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li><a href="#vision" className="hover:text-ink transition-colors">About Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-ink/30">
          <p>© 2026 ngl black garlic. All rights reserved.</p>
          <div className="flex gap-8">
            <button 
              onClick={() => openLegal('Privacy Policy', (
                <div className="space-y-6">
                  <p>At ngl black garlic, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information in accordance with the Australian Privacy Principles.</p>
                  
                  <section>
                    <h3 className="font-bold text-ink mb-2">1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you sign up for our newsletter, contact us, or make a purchase. This may include your name, email address, and shipping details.</p>
                  </section>

                  <section>
                    <h3 className="font-bold text-ink mb-2">2. Cookies and Tracking</h3>
                    <p>We use cookies and similar technologies (like Google Analytics) to understand how you interact with our website. These small files help us distinguish you from other users and improve your browsing experience.</p>
                    <p className="mt-2">You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.</p>
                  </section>

                  <section>
                    <h3 className="font-bold text-ink mb-2">3. How We Use Your Information</h3>
                    <p>We use your information to fulfill orders, communicate with you about our products, and analyze website traffic to improve our services. We do not sell your personal information to third parties.</p>
                  </section>

                  <section>
                    <h3 className="font-bold text-ink mb-2">4. Data Security</h3>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                  </section>

                  <section>
                    <h3 className="font-bold text-ink mb-2">5. Your Rights</h3>
                    <p>Under the Australian Privacy Act, you have the right to access the personal information we hold about you and request corrections if necessary.</p>
                  </section>
                </div>
              ))}
              className="text-xs uppercase tracking-widest hover:text-gold transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openLegal('Terms of Service', (
                <>
                  <p>By using our website, you agree to these terms of service. Please read them carefully.</p>
                  <h3 className="font-bold text-ink">Use of Website</h3>
                  <p>You agree to use this website for lawful purposes only.</p>
                  <h3 className="font-bold text-ink">Intellectual Property</h3>
                  <p>All content on this website is the property of ngl black garlic.</p>
                  <h3 className="font-bold text-ink">Use of Artificial Intelligence</h3>
                  <p>You acknowledge that some content on this website is created using artificial intelligence (AI). The actual products delivered may differ slightly from the concept presented.</p>
                </>
              ))}
              className="text-xs uppercase tracking-widest hover:text-gold transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
