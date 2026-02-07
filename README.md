# Razorpay Test-Mode Integration (Learning Project)

This repository demonstrates a complete **Razorpay payment gateway integration** using **Node.js + Express + MongoDB + React**. It focuses on **order creation**, **payment verification**, and **webhook handling** so you can learn the full backend flow.

## ✅ What’s Included

- **Create Razorpay order** (`POST /api/payments/create-order`)
- **Verify payment signature** (`POST /api/payments/verify`)
- **Handle webhooks** (`POST /api/payments/webhook`)
- **MongoDB Order model** updated with Razorpay fields
- **React checkout button** + Razorpay Checkout integration
- **Beginner-friendly comments** explaining each step

---

## 📦 Backend Setup (Node.js + Express + MongoDB)

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env` and add your test keys:

```bash
cp .env.example .env
```

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3) Start MongoDB

Ensure MongoDB is running locally:

```bash
mongod
```

### 4) Start backend server

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

## 🌐 Frontend Setup (React + Razorpay Checkout)

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure frontend env

```bash
cp .env.example .env
```

```env
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_API_BASE_URL=http://localhost:5000
```

### 3) Start frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔄 Payment Flow (Step-by-Step)

1. **User clicks “Pay Now”** in the frontend.
2. Frontend calls **`POST /api/payments/create-order`** with `totalAmount`.
3. Backend creates a Razorpay order using the Razorpay SDK.
4. Razorpay returns an `orderId`, which is sent to the frontend.
5. Frontend opens **Razorpay Checkout** using the `orderId` and test `key_id`.
6. Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
7. Frontend sends those values to **`POST /api/payments/verify`**.
8. Backend recomputes the signature using the secret key and verifies it.
9. If valid → Order is marked **PAID** in MongoDB.
10. Webhooks (optional) provide additional server-side confirmation.

---

## 🔐 Why Signature Verification Matters

Razorpay sends a signed payload after payment. If you **don’t verify the signature**, anyone could fake a payment response and mark an order as paid.

The backend uses:

```js
crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(orderId + '|' + paymentId)
  .digest('hex');
```

…and compares it with `razorpay_signature` from the frontend.

---

## 📡 Webhooks (Server-to-Server Updates)

Webhooks are **secure notifications** from Razorpay to your backend. They are useful when the frontend fails or the user closes the tab.

### Sample Webhook Payload

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_29QQoUBi66xm2f",
        "order_id": "order_9A33XWu170gUtm",
        "status": "captured",
        "method": "card",
        "amount": 49900,
        "currency": "INR"
      }
    }
  }
}
```

The backend verifies the webhook signature using `RAZORPAY_WEBHOOK_SECRET` before updating the order.

---

## 🧪 Local Testing Guide

### ✅ Test Order Creation

```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"totalAmount": 499}'
```

### ✅ Test Payment Flow

1. Open `http://localhost:5173` in the browser.
2. Enter amount and click **Pay Now**.
3. Use Razorpay test card:

```
Card Number: 4111 1111 1111 1111
Expiry: 12/30
CVV: 123
```

### ✅ Test Webhook Locally

Use Razorpay CLI or ngrok to expose your backend:

```bash
razorpay listen --forward-to localhost:5000/api/payments/webhook
```

---

## ✅ Security Best Practices

- **Never expose `RAZORPAY_KEY_SECRET` on the frontend**
- Always verify signatures on the backend
- Use webhooks for secondary confirmation
- Use test keys only in development

---

## 📁 Project Structure

```
backend/
  models/Order.js
  routes/payments.js
  server.js
frontend/
  src/App.jsx
  src/main.jsx
README.md
```

---

Happy Learning! 🚀
