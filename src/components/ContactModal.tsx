import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { mockApiCall } from '../mockServer';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
      let response;

      if (useMock) {
        response = await mockApiCall('/api/contact', { name, email, subject, message });
      } else {
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });
      }

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact Error:', error);
      setStatus('error');
      setErrorMessage('Failed to connect to the server.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-paper p-8 max-w-md w-full relative rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ink/50 hover:text-ink"
            >
              <X size={24} />
            </button>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="text-gold" size={48} />
                </div>
                <h2 className="text-3xl font-serif mb-4">Message Sent!</h2>
                <p className="text-ink/60 mb-8">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button 
                  onClick={onClose} 
                  className="bg-gold text-paper px-8 py-3 text-xs font-bold uppercase tracking-widest w-full hover:bg-gold/90 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-serif mb-6">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors w-full rounded-lg"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors w-full rounded-lg"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-white border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors w-full rounded-lg"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Message" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors w-full h-32 rounded-lg resize-none"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  
                  {status === 'error' && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="bg-gold text-paper px-4 py-3 text-xs font-bold uppercase tracking-widest w-full hover:bg-gold/90 transition-colors disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
