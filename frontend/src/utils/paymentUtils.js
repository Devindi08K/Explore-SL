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
    itemsDescription,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    country,
    returnUrl,
    cancelUrl,
    notifyUrl, // This should be /payments/payhere/notify not /api/payments/payhere/notify
    mode
  } = paymentDetails;
  
  // Create a form to submit to PayHere
  const form = document.createElement('form');
  form.method = 'POST';
  
  // Set the correct PayHere URL based on mode
  form.action = mode === 'live' 
    ? 'https://www.payhere.lk/pay/checkout'
    : 'https://sandbox.payhere.lk/pay/checkout';
  
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
  addField('items', itemsDescription);
  addField('currency', currency);
  addField('amount', amount);
  
  // Customer details
  addField('first_name', firstName);
  addField('last_name', lastName);
  addField('email', email);
  addField('phone', phone || '0771234567'); // PayHere requires a phone number
  addField('address', address);
  addField('city', city);
  addField('country', country);
  
  // Append the form to the body and submit it
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};