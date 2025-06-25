import React, { useState } from 'react';
import api from '../../utils/api';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  serviceType, 
  amount, 
  description, 
  itemId 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Send request to backend to initialize payment
      const response = await api.post('/payments/initialize', {
        serviceType,
        amount,
        description,
        itemId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone
      });
      
      const paymentDetails = response.data;
      
      // Create the form for PayHere submission
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Use sandbox for testing
      
      // Add required fields to the form
      const addField = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      
      // Add PayHere required fields
      addField('merchant_id', paymentDetails.merchantId);
      addField('return_url', paymentDetails.returnUrl);
      addField('cancel_url', paymentDetails.cancelUrl);
      addField('notify_url', paymentDetails.notifyUrl);
      addField('order_id', paymentDetails.orderId);
      addField('items', description);
      addField('currency', 'LKR');
      addField('amount', amount);
      
      // Add customer information
      addField('first_name', formData.name.split(' ')[0] || '');
      addField('last_name', formData.name.split(' ').slice(1).join(' ') || '');
      addField('email', formData.email);
      addField('phone', formData.phone);
      addField('address', 'Sri Lanka');
      addField('city', 'Colombo');
      addField('country', 'Sri Lanka');
      
      // Add hash value for security
      addField('hash', paymentDetails.hash);
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setError('Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Payment Details</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
          </div>
          
          <div className="bg-cream/50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="text-xl font-bold text-charcoal">LKR {amount.toLocaleString()}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Ex: 071XXXXXXX"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-tan text-white rounded-lg hover:bg-gold transition-colors flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Pay Now'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Secure payment powered by PayHere</p>
            <div className="flex justify-center mt-2 space-x-3">
              <img src="https://www.payhere.lk/downloads/images/pay-here-cards.png" alt="Payment methods" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;