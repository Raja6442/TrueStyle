import React, { useState } from 'react';
import { X, QrCode, Smartphone, CreditCard, CheckCircle2, Loader2, Wallet, Award } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  billingCycle: string;
}

type PaymentMethod = 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'razorpay';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, price, billingCycle }) => {
  const truePointsAvailable = parseInt(localStorage.getItem('truePoints') || '0');
  const maxDiscount = Math.min(price, Math.floor(truePointsAvailable * 0.5)); // 1 point = 0.5 INR
  const [applyPointsState, setApplyPointsState] = useState(false);
  
  const discount = applyPointsState ? maxDiscount : 0;
  const finalPrice = price - discount;

  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // True Points Integration
  const [truePoints, setTruePoints] = useState(truePointsAvailable);
  const applyPoints = applyPointsState;
  const setApplyPoints = setApplyPointsState;

  if (!isOpen) return null;

  const handlePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeMethod === 'upi' && !upiId.trim()) return;

    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        if (applyPoints) {
          const newPoints = Math.max(0, truePoints - Math.floor(discount * 2));
          localStorage.setItem('truePoints', newPoints.toString());
          setTruePoints(newPoints);
        }
        setIsSuccess(false);
        setUpiId('');
        onClose();
      }, 3000);
    }, 2500);
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h3>
      <p className="text-muted text-center max-w-sm">
        Your subscription to {planName} has been activated. A receipt has been sent to your email.
      </p>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Loader2 className="w-16 h-16 text-accent animate-spin mb-6" />
      <h3 className="text-xl font-bold text-foreground mb-2">Processing Payment...</h3>
      <p className="text-muted text-sm">Please do not close this window</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isProcessing && !isSuccess && onClose()}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-cyber-dark-bg border border-border rounded-2xl shadow-[0_0_50px_rgba(0,67,189,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        {!isSuccess && !isProcessing && (
          <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
            <div>
              <h2 className="text-xl font-bold text-foreground">Checkout</h2>
              <p className="text-sm text-muted">Complete your TrueStyle subscription</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {isSuccess ? renderSuccess() : isProcessing ? renderProcessing() : (
          <div className="flex flex-col md:flex-row h-full">
            
            {/* Left Sidebar - Payment Methods */}
            <div className="w-full md:w-1/3 bg-card/30 border-r border-border p-4 flex flex-col space-y-2">
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2">Payment Options</div>
              
              <button 
                onClick={() => setActiveMethod('upi')}
                className={`flex items-center w-full p-3 rounded-lg text-sm font-semibold transition ${activeMethod === 'upi' ? 'bg-accent/20 text-accent border border-accent/50' : 'text-muted hover:bg-white/5 hover:text-foreground border border-transparent'}`}
              >
                <QrCode className="w-4 h-4 mr-3" />
                UPI / QR
              </button>

              <button 
                onClick={() => setActiveMethod('gpay')}
                className={`flex items-center w-full p-3 rounded-lg text-sm font-semibold transition ${activeMethod === 'gpay' ? 'bg-accent/20 text-accent border border-accent/50' : 'text-muted hover:bg-white/5 hover:text-foreground border border-transparent'}`}
              >
                <Smartphone className="w-4 h-4 mr-3" />
                Google Pay
              </button>

              <button 
                onClick={() => setActiveMethod('phonepe')}
                className={`flex items-center w-full p-3 rounded-lg text-sm font-semibold transition ${activeMethod === 'phonepe' ? 'bg-accent/20 text-accent border border-accent/50' : 'text-muted hover:bg-white/5 hover:text-foreground border border-transparent'}`}
              >
                <Smartphone className="w-4 h-4 mr-3" />
                PhonePe
              </button>

              <button 
                onClick={() => setActiveMethod('paytm')}
                className={`flex items-center w-full p-3 rounded-lg text-sm font-semibold transition ${activeMethod === 'paytm' ? 'bg-accent/20 text-accent border border-accent/50' : 'text-muted hover:bg-white/5 hover:text-foreground border border-transparent'}`}
              >
                <Wallet className="w-4 h-4 mr-3" />
                Paytm
              </button>

              <div className="my-2 border-t border-border/50"></div>

              <button 
                onClick={() => setActiveMethod('razorpay')}
                className={`flex items-center w-full p-3 rounded-lg text-sm font-semibold transition ${activeMethod === 'razorpay' ? 'bg-accent/20 text-accent border border-accent/50' : 'text-muted hover:bg-white/5 hover:text-foreground border border-transparent'}`}
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Razorpay (Cards)
              </button>
            </div>

            {/* Right Content - Payment Details */}
            <div className="w-full md:w-2/3 p-6 flex flex-col">
              
              {/* Order Summary */}
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{planName}</h4>
                    <p className="text-xs text-muted">Billed {billingCycle}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold font-mono ${applyPoints ? 'text-muted line-through text-sm' : 'text-foreground'}`}>₹{price}</div>
                    {applyPoints && (
                      <div className="text-xl font-bold text-green-400 font-mono">₹{finalPrice}</div>
                    )}
                  </div>
                </div>
                
                {truePoints > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-2">
                        <Award className={`w-4 h-4 ${applyPoints ? 'text-green-400' : 'text-muted'}`} />
                        <span className="text-xs font-semibold text-foreground">Apply True Points ({truePoints} pts)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-green-400 font-mono font-bold">-₹{discount}</span>
                        <input 
                          type="checkbox" 
                          checked={applyPoints}
                          onChange={(e) => setApplyPoints(e.target.checked)}
                          className="rounded bg-black border-border text-green-500 focus:ring-green-500 focus:ring-offset-0"
                        />
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Payment Content */}
              <div className="flex-grow flex flex-col justify-center">
                
                {activeMethod === 'upi' && (
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-white p-2 rounded-lg mb-6 shadow-neon-blue">
                      {/* Fake QR Code made with CSS grid for realism */}
                      <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1 p-1">
                        {[...Array(25)].map((_, i) => (
                          <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'} rounded-sm`}></div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted mb-4 text-center">Scan with any UPI app to pay</p>
                    
                    <div className="w-full flex items-center justify-center gap-4 mb-6">
                      <div className="h-[1px] w-full bg-border"></div>
                      <span className="text-xs text-muted font-bold uppercase">OR</span>
                      <div className="h-[1px] w-full bg-border"></div>
                    </div>

                    <form onSubmit={handlePayment} className="w-full">
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Enter UPI ID</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. 9876543210@ybl" 
                          className="flex-grow glass-input px-4 py-2.5 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-2 focus:ring-accent outline-none"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={!upiId.trim()}
                          className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold rounded-lg transition"
                        >
                          Pay
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {(activeMethod === 'gpay' || activeMethod === 'phonepe' || activeMethod === 'paytm' || activeMethod === 'razorpay') && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center mb-6 border border-border shadow-neon-blue">
                      {activeMethod === 'gpay' && <Smartphone className="w-10 h-10 text-blue-500" />}
                      {activeMethod === 'phonepe' && <Smartphone className="w-10 h-10 text-purple-500" />}
                      {activeMethod === 'paytm' && <Wallet className="w-10 h-10 text-blue-400" />}
                      {activeMethod === 'razorpay' && <CreditCard className="w-10 h-10 text-blue-600" />}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Pay with {
                        activeMethod === 'gpay' ? 'Google Pay' : 
                        activeMethod === 'phonepe' ? 'PhonePe' : 
                        activeMethod === 'paytm' ? 'Paytm' : 
                        'Razorpay'
                      }
                    </h3>
                    <p className="text-sm text-muted mb-8 max-w-xs">
                      You will be redirected securely to complete your payment of ₹{finalPrice}.
                    </p>
                    <button 
                      onClick={() => handlePayment()}
                      className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition shadow-[0_0_20px_rgba(0,67,189,0.4)]"
                    >
                      Proceed to Pay ₹{finalPrice}
                    </button>
                  </div>
                )}

              </div>
              
              <div className="mt-6 text-center">
                <p className="text-[10px] text-muted flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                  Payments are secure and encrypted
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
