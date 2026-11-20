import React from 'react';
import { CheckCircle2, ShoppingBag, Heart, Trash2, AlertCircle, Sparkles, Info } from 'lucide-react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-red-400 shrink-0" />;
      case 'wishlist-add':
        return <Heart className="w-5 h-5 fill-red-500 text-red-500 shrink-0" />;
      case 'wishlist-remove':
        return <Heart className="w-5 h-5 text-slate-400 shrink-0" />;
      case 'delete':
        return <Trash2 className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'newsletter':
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-300 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border border-slate-700/50 animate-bounce">
      {renderIcon()}
      <span>{toast.message}</span>
    </div>
  );
}
