import React from 'react';
import { Logo } from '../components/Logo';
import { LoginForm } from '../components/LoginForm';

export const Login: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80")',
      }}
    >
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))'
        }}
      />
      
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};