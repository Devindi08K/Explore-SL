import api from './api';

export const initializePayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPaymentStatus = async (orderId) => {
  try {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to redirect to PayHere payment gateway
export const redirectToPayhere = (paymentDetails) => {
  const { 
    merchantId, 
    orderId, 
    amount, 
    currency, 
    hash, 
    returnUrl, 
    cancelUrl, 
    notifyUrl,
    customerName,
    customerEmail,
    customerPhone,
    itemDescription 
  } = paymentDetails;

  // Create a form to submit to PayHere
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Change to 'https://www.payhere.lk/pay/checkout' for production
  
  // Add all required fields
  const addField = (name, value) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };
  
  // Required fields
  addField('merchant_id', merchantId);
  addField('return_url', returnUrl);
  addField('cancel_url', cancelUrl);
  addField('notify_url', notifyUrl);
  addField('order_id', orderId);
  addField('items', itemDescription || 'Tourism Services');
  addField('currency', currency);
  addField('amount', amount);
  
  // Customer details
  addField('first_name', customerName?.split(' ')[0] || '');
  addField('last_name', customerName?.split(' ').slice(1).join(' ') || '');
  addField('email', customerEmail);
  addField('phone', customerPhone);
  addField('address', 'Sri Lanka');
  addField('city', 'Colombo');
  addField('country', 'Sri Lanka');
  
  // Hash value
  addField('hash', hash);
  
  // Add the form to the body and submit it
  document.body.appendChild(form);
  form.submit();
};