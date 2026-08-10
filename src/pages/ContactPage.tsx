import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';
import { dbRouter } from '../services/databaseRouter';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setLoading(true);
    try {
      await dbRouter.addTicket({
        user_id: user?.id,
        name,
        email,
        subject,
        message
      });

      await dbRouter.addLog({
        actor_id: user?.id || 'guest',
        actor_name: name,
        action: 'contact_ticket_submitted',
        details: `Submitted support ticket regarding "${subject}".`,
        ip_address: '127.0.0.1'
      });

      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          SECURE CONNECTION
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Reach out to our cybersecurity operations team to report fraudulent vendors or submit account support tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <GlassCard className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-2.5 rounded-lg border border-cyber-blue-700/30 text-cyber-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase">Secure Mail</h4>
              <p className="text-xs text-gray-400 mt-1 select-all">ops@truestyle.security</p>
              <p className="text-[10px] text-gray-500 mt-0.5">PGP Key ID: 0x9F32A881</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-2.5 rounded-lg border border-cyber-blue-700/30 text-cyber-blue-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase">Hotline Support</h4>
              <p className="text-xs text-gray-400 mt-1 select-all">+1 (800) 555-TSEC</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Mon - Fri, 09:00 - 18:00 UTC</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-2.5 rounded-lg border border-cyber-blue-700/30 text-cyber-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase">Operations HQ</h4>
              <p className="text-xs text-gray-400 mt-1 select-all">600 Tech Plaza, Suite 900</p>
              <p className="text-[10px] text-gray-500 mt-0.5">San Francisco, CA 94105</p>
            </div>
          </GlassCard>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-xl font-bold text-white font-mono mb-6 uppercase tracking-wider">
              File Support Ticket / Vulnerability Report
            </h3>
            
            {success ? (
              <div className="p-6 bg-cyber-blue-900/30 border border-cyber-blue-500/30 rounded-xl text-center space-y-3">
                <div className="inline-flex p-2 rounded-full bg-cyber-blue-700 text-white animate-bounce">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Ticket Logged Successfully</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your request has been filed in our Postgres audit database. A security analyst will review your notes and contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs text-cyber-blue-400 hover:text-white underline transition"
                >
                  File another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-white"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-white"
                      placeholder="user@truestyle.security"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-white"
                    placeholder="e.g. Counterfeit alert flag error, API connection inquiry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Message Description</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-white resize-none"
                    placeholder="Enter detailed request specifications..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyber-blue-700 hover:bg-cyber-blue-600 font-semibold text-xs text-white tracking-widest uppercase transition flex items-center justify-center space-x-2 shadow-neon-blue disabled:opacity-50"
                >
                  <span>{loading ? 'Logging Ticket...' : 'Transmit Ticket'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
