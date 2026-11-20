import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials requested by user:
      // admin mail : admin@madhusri.com
      // password : admin@2026
      if (email.trim().toLowerCase() === 'admin@madhusri.com' && password === 'admin@2026') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Please check mail and password.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Store Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm transition border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-fadeIn">
        
        {/* Card Header */}
        <div className="bg-gradient-to-r from-red-700 via-[#d32f2f] to-red-800 p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white rounded-2xl p-2 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <img 
              src="/madhusri.png" 
              alt="Madhu Sri Crackers" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Admin Portal Login
          </h1>
          <p className="text-xs text-red-100 mt-1">
            Madhu Sri Crackers Management Console
          </p>
        </div>

        {/* Card Body & Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="enter mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] active:bg-[#9a1414] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Helper Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authorized Admin Credentials:</span>
            </div>
            <div>Email: <code className="text-red-600 font-mono font-semibold">admin@madhusri.com</code></div>
            <div>Password: <code className="text-red-600 font-mono font-semibold">admin@2026</code></div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Madhu Sri Crackers Management System - Amman Complex, Veerasigamani
      </div>
    </div>
  );
}

