import React from 'react';
import { X } from 'lucide-react';
import { UserSalesSummary } from './UserSalesSummary';

interface SalesSummaryModalProps {
  onClose: () => void;
}

export const SalesSummaryModal: React.FC<SalesSummaryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <UserSalesSummary />
        </div>
      </div>
    </div>
  );
};