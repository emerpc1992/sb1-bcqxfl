import React from 'react';
import { Scissors } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Scissors className="w-6 h-6 text-pink-600" />
      <div className="text-center">
        <h1 className="text-lg font-bold text-gray-800">Alvaro Rugama</h1>
        <p className="text-xs text-pink-600">Make Up Studio & Beauty Salon</p>
      </div>
    </div>
  );
};