import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string | null;
  abGroup: string;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({ isOpen, onClose, productName, abGroup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    setErrorMessage('');
    try {
      const response = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productName, abGroup }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to connect to the server.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {status === 'success' ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2">You got it!</h3>
                <p>Keep an eye out for the email with discount code.</p>
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-ink text-white rounded-lg">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-2">Thank you for sharing our excitement!</h3>
                <p className="text-base mb-4">We are currently perfecting our limited first batch. Please leave your details so we can tell you when it's ready, along with a sweet 10% discount!</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name (optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email (mandatory)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
                {status === 'error' && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                <div className="mt-6 flex gap-4">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">No, thanks</button>
                  <button type="submit" disabled={status === 'submitting'} className="flex-1 px-4 py-2 bg-ink text-white rounded-lg hover:bg-ink/90 disabled:opacity-50">
                    {status === 'submitting' ? 'Submitting...' : 'Yes, let me know'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
