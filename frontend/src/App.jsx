import { useState } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

function App() {
  const [amount, setAmount] = useState(499);
  const [status, setStatus] = useState('Ready to pay');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatus('Creating Razorpay order...');

      const createOrderResponse = await axios.post(`${apiBaseUrl}/api/payments/create-order`, {
        totalAmount: Number(amount),
      });

      const { orderId, amount: orderAmount, currency, dbOrderId } = createOrderResponse.data;

      setStatus('Opening Razorpay Checkout...');

      const options = {
        key: razorpayKeyId,
        amount: orderAmount,
        currency,
        name: 'Demo Store',
        description: 'Learning Razorpay integration',
        order_id: orderId,
        handler: async (response) => {
          setStatus('Verifying payment...');

          const verifyResponse = await axios.post(`${apiBaseUrl}/api/payments/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: dbOrderId,
          });

          setStatus(`Payment successful! Order status: ${verifyResponse.data.order.paymentStatus}`);
        },
        modal: {
          ondismiss: () => {
            setStatus('Payment popup closed.');
          },
        },
        theme: {
          color: '#0f5efd',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setStatus(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Something went wrong during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: 520 }}>
      <h1>Razorpay Checkout Demo</h1>
      <p>
        This page demonstrates a full Razorpay payment flow with order creation, signature
        verification, and webhook updates.
      </p>

      <label htmlFor="amount">Amount (INR)</label>
      <input
        id="amount"
        type="number"
        min="1"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        style={{ display: 'block', margin: '0.5rem 0 1rem', padding: '0.5rem', width: '100%' }}
      />

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || !razorpayKeyId}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#0f5efd',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 4,
        }}
      >
        {loading ? 'Processing...' : `Pay Now (${currencyFormatter.format(amount)})`}
      </button>

      {!razorpayKeyId && (
        <p style={{ color: 'crimson', marginTop: '1rem' }}>
          Please set VITE_RAZORPAY_KEY_ID in your frontend .env file.
        </p>
      )}

      <p style={{ marginTop: '1.5rem' }}>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}

export default App;
