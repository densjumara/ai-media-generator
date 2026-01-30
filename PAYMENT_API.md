# 🔌 Payment API Integration Guide

## Overview
Panduan lengkap untuk mengintegrasikan sistem pembayaran dengan backend server.

---

## 📡 Backend Endpoints (Node.js/Express)

### 1. Create Payment
**Endpoint:** `POST /api/payment/create`

```javascript
// Request
{
  "userId": "user123",
  "planType": "monthly|yearly|vvip",
  "paymentMethod": "bank|dana|gopay|paypal",
  "amount": 50000,
  "currency": "IDR",
  "userEmail": "user@example.com"
}

// Response (Success)
{
  "success": true,
  "invoiceNumber": "INV-20260129-5678",
  "paymentId": 123,
  "status": "pending",
  "expiresAt": "2026-01-30T10:00:00.000Z"
}

// Response (Error)
{
  "success": false,
  "error": "Invalid plan type"
}
```

**Implementation (Express.js):**
```javascript
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const { generateInvoiceNumber } = require('../utils/payment');
const { sendEmail } = require('../services/email');

router.post('/create', async (req, res) => {
  try {
    const { userId, planType, paymentMethod, amount, userEmail } = req.body;

    // Validate
    if (!['monthly', 'yearly', 'vvip'].includes(planType)) {
      return res.status(400).json({ success: false, error: 'Invalid plan type' });
    }

    if (!['bank', 'dana', 'gopay', 'paypal'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, error: 'Invalid payment method' });
    }

    // Create payment record
    const invoiceNumber = generateInvoiceNumber();
    const payment = await Payment.create({
      userId,
      invoiceNumber,
      planType,
      paymentMethod,
      amount,
      status: 'pending'
    });

    // Send order confirmation email
    await sendEmail({
      to: userEmail,
      subject: `Pesanan Langganan Berhasil - ${invoiceNumber}`,
      template: 'order-confirmation',
      data: {
        userName: req.body.userName,
        planName: getPlanName(planType),
        amount,
        invoiceNumber,
        paymentInstructions: getPaymentInstructions(paymentMethod)
      }
    });

    res.json({
      success: true,
      invoiceNumber,
      paymentId: payment.id,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 jam
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

### 2. Confirm Payment
**Endpoint:** `POST /api/payment/confirm/:invoiceNumber`

```javascript
// Request
{
  "proof": "transfer_proof_url|dana_transfer_id|gopay_transfer_id",
  "confirmedBy": "admin|system",
  "notes": "Optional notes"
}

// Response (Success)
{
  "success": true,
  "message": "Payment confirmed",
  "subscriptionActivated": true,
  "expiresAt": "2026-02-29T10:00:00.000Z"
}
```

**Implementation:**
```javascript
router.post('/confirm/:invoiceNumber', async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const { proof, confirmedBy, notes } = req.body;

    // Find payment
    const payment = await Payment.findOne({ invoiceNumber });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Payment already processed' });
    }

    // Update payment
    payment.status = 'completed';
    payment.proofUrl = proof;
    payment.confirmedBy = confirmedBy;
    payment.notes = notes;
    payment.completedAt = new Date();
    await payment.save();

    // Calculate expiry date
    const expiryDate = calculateExpiryDate(payment.planType);

    // Create subscription
    const subscription = await Subscription.create({
      userId: payment.userId,
      planType: payment.planType,
      status: 'active',
      activatedAt: new Date(),
      expiresAt: expiryDate,
      paymentId: payment.id
    });

    // Send activation email
    const user = await User.findById(payment.userId);
    await sendEmail({
      to: user.email,
      subject: 'Langganan Anda Telah Diaktifkan!',
      template: 'subscription-activated',
      data: {
        userName: user.name,
        planName: getPlanName(payment.planType),
        expiresAt: expiryDate
      }
    });

    res.json({
      success: true,
      message: 'Payment confirmed and subscription activated',
      subscriptionActivated: true,
      expiresAt: expiryDate
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 3. Get Payment History
**Endpoint:** `GET /api/payment/history/:userId`

```javascript
// Response
{
  "success": true,
  "payments": [
    {
      "id": 1,
      "invoiceNumber": "INV-20260129-5678",
      "planType": "monthly",
      "amount": 50000,
      "status": "completed",
      "paymentMethod": "bank",
      "createdAt": "2026-01-29T10:00:00.000Z",
      "completedAt": "2026-01-29T10:05:00.000Z"
    }
  ]
}
```

**Implementation:**
```javascript
router.get('/history/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      payments,
      total: payments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 4. Get Current Subscription
**Endpoint:** `GET /api/subscription/current/:userId`

```javascript
// Response
{
  "success": true,
  "subscription": {
    "id": 1,
    "planType": "monthly",
    "status": "active",
    "activatedAt": "2026-01-29T10:00:00.000Z",
    "expiresAt": "2026-02-29T10:00:00.000Z",
    "daysRemaining": 31,
    "isExpiringSoon": false
  }
}
```

**Implementation:**
```javascript
router.get('/current/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({
      userId,
      status: 'active'
    });

    if (!subscription) {
      return res.json({ success: true, subscription: null });
    }

    const now = new Date();
    const expiresAt = new Date(subscription.expiresAt);
    const daysRemaining = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      subscription: {
        ...subscription.toObject(),
        daysRemaining,
        isExpiringSoon: daysRemaining <= 7
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 5. Webhook - Bank Transfer Confirmation (Manual)
**Endpoint:** `POST /api/payment/webhook/bank`

```javascript
// This would be called manually or via bank API
// Request
{
  "bankAccountNumber": "428901018765539",
  "transactionAmount": 50000,
  "senderName": "John Doe",
  "bankAccountHolder": "Deni Hendryani Jumara",
  "transactionId": "BRI20260129001234",
  "transactionDate": "2026-01-29"
}
```

**Implementation:**
```javascript
router.post('/webhook/bank', verifyBankWebhook, async (req, res) => {
  try {
    const { bankAccountNumber, transactionAmount, senderName, transactionId } = req.body;

    // Find matching pending payment
    const payment = await Payment.findOne({
      amount: transactionAmount,
      paymentMethod: 'bank',
      status: 'pending'
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'No matching payment found' });
    }

    // Auto confirm payment
    payment.status = 'completed';
    payment.proofUrl = transactionId;
    payment.confirmedBy = 'bank-webhook';
    payment.completedAt = new Date();
    await payment.save();

    // Activate subscription
    const expiryDate = calculateExpiryDate(payment.planType);
    await Subscription.create({
      userId: payment.userId,
      planType: payment.planType,
      status: 'active',
      activatedAt: new Date(),
      expiresAt: expiryDate,
      paymentId: payment.id
    });

    res.json({ success: true, message: 'Bank transfer confirmed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 6. Webhook - PayPal IPN
**Endpoint:** `POST /api/payment/webhook/paypal`

```javascript
router.post('/webhook/paypal', async (req, res) => {
  try {
    const { id, status, purchase_units } = req.body;

    if (status !== 'COMPLETED') {
      return res.json({ success: false, message: 'Payment not completed' });
    }

    // Find payment by reference
    const payment = await Payment.findOne({
      paypalTransactionId: id
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    // Confirm payment
    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    // Activate subscription
    const expiryDate = calculateExpiryDate(payment.planType);
    await Subscription.create({
      userId: payment.userId,
      planType: payment.planType,
      status: 'active',
      activatedAt: new Date(),
      expiresAt: expiryDate,
      paymentId: payment.id
    });

    res.json({ success: true, message: 'PayPal webhook processed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🗄️ Database Models

### Payment Model
```javascript
const paymentSchema = new Schema({
  userId: { type: String, required: true, index: true },
  invoiceNumber: { type: String, unique: true, required: true, index: true },
  planType: { 
    type: String, 
    enum: ['monthly', 'yearly', 'vvip'], 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  paymentMethod: { 
    type: String, 
    enum: ['bank', 'dana', 'gopay', 'paypal'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  proofUrl: String,
  confirmedBy: String,
  notes: String,
  createdAt: { type: Date, default: Date.now, index: true },
  completedAt: Date,
  expiresAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
```

### Subscription Model
```javascript
const subscriptionSchema = new Schema({
  userId: { type: String, required: true, index: true, unique: true },
  planType: { 
    type: String, 
    enum: ['monthly', 'yearly', 'vvip'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
    index: true
  },
  activatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true },
  autoRenew: { type: Boolean, default: false },
  paymentId: mongoose.Schema.Types.ObjectId,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
```

---

## 🔒 Security Best Practices

1. **Validate all inputs**
2. **Use HTTPS only**
3. **Implement CSRF protection**
4. **Rate limiting on payment endpoints**
5. **Audit logging for all transactions**
6. **Encrypt sensitive data**
7. **Implement 2FA for admin payment confirmation**

---

## 📊 Testing

### Unit Tests
```javascript
const request = require('supertest');
const app = require('../app');

describe('Payment API', () => {
  it('should create a new payment', async () => {
    const res = await request(app)
      .post('/api/payment/create')
      .send({
        userId: 'test-user',
        planType: 'monthly',
        paymentMethod: 'bank',
        amount: 50000,
        userEmail: 'test@example.com'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.invoiceNumber).toMatch(/^INV-/);
  });

  it('should confirm a payment', async () => {
    // Create payment first
    const payment = await Payment.create({
      userId: 'test-user',
      invoiceNumber: 'INV-TEST-001',
      planType: 'monthly',
      amount: 50000,
      paymentMethod: 'bank',
      status: 'pending'
    });

    const res = await request(app)
      .post('/api/payment/confirm/INV-TEST-001')
      .send({
        proof: 'TRX123456',
        confirmedBy: 'admin'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.subscriptionActivated).toBe(true);
  });
});
```

---

**Versi:** 1.0  
**Last Updated:** 29 January 2026  
**Status:** ✅ Ready for Integration
