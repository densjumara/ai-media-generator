import express from 'express';
import path from 'path';
import { readJSON, writeJSON } from '../utils/jsonStore.js';

const router = express.Router();

const DATA_DIR = path.join(process.cwd(), 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

// Basic payment configuration (kept simple and mirrored to frontend)
const PAYMENT_CONFIG = {
  bank: {
    bankName: 'Bank BRI',
    accountNumber: '428901018765539',
    accountHolder: 'Deni Hendryani Jumara'
  },
  dana: {
    app: 'Dana',
    phoneNumber: '081234446625',
    accountHolder: 'Deni Hendryani Jumara'
  },
  gopay: {
    app: 'GoPay',
    phoneNumber: '081234446625',
    accountHolder: 'Deni Hendryani Jumara'
  },
  paypal: {
    email: 'dhjumara78@gmail.com',
    accountHolder: 'Deni Hendryani Jumara'
  }
};

async function savePayment(payment) {
  const payments = await readJSON(PAYMENTS_FILE, []);
  payments.push(payment);
  await writeJSON(PAYMENTS_FILE, payments);
}

async function updatePayment(invoiceNumber, patch) {
  const payments = await readJSON(PAYMENTS_FILE, []);
  const idx = payments.findIndex(p => p.invoiceNumber === invoiceNumber);
  if (idx === -1) return null;
  payments[idx] = { ...payments[idx], ...patch };
  await writeJSON(PAYMENTS_FILE, payments);
  return payments[idx];
}

async function activateSubscription(payment) {
  const subscriptions = await readJSON(SUBSCRIPTIONS_FILE, []);
  const expiry = new Date();
  if (payment.planType === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
  else if (payment.planType === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);
  else expiry.setFullYear(expiry.getFullYear() + 100);

  const sub = {
    invoiceNumber: payment.invoiceNumber,
    planType: payment.planType,
    planName: payment.planName,
    activatedAt: new Date().toISOString(),
    expiresAt: expiry.toISOString(),
    status: 'active'
  };

  subscriptions.push(sub);
  await writeJSON(SUBSCRIPTIONS_FILE, subscriptions);
  return sub;
}

// Create a payment (frontend will call this when user initiates payment)
router.post('/create', async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.invoiceNumber) return res.status(400).json({ success: false, error: 'Missing invoiceNumber' });

    const payment = {
      invoiceNumber: body.invoiceNumber,
      planType: body.planType || 'monthly',
      planName: body.planName || '',
      price: body.price || 0,
      paymentMethod: body.paymentMethod || 'bank',
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: body.metadata || {}
    };

    await savePayment(payment);

    const instructions = PAYMENT_CONFIG[payment.paymentMethod] || {};

    return res.json({ success: true, payment, instructions });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Webhook for bank transfers (automatic confirmation)
router.post('/webhook/bank', async (req, res) => {
  try {
    const { bankAccountNumber, transactionAmount, senderName, bankAccountHolder, transactionId, transactionDate } = req.body;

    // Find pending payment with matching amount and bank account
    const payments = await readJSON(PAYMENTS_FILE, []);
    const match = payments.find(p => p.status === 'pending' && p.price === transactionAmount && p.paymentMethod === 'bank');

    if (!match) {
      return res.status(404).json({ success: false, error: 'No matching pending payment found' });
    }

    // Update payment to confirmed
    await updatePayment(match.invoiceNumber, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      confirmation: { type: 'bankWebhook', bankAccountNumber, bankAccountHolder, senderName, transactionId, transactionDate }
    });

    // Activate subscription
    const sub = await activateSubscription(match);

    return res.json({ success: true, invoice: match.invoiceNumber, subscription: sub });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Manual confirmation endpoint (admin/user uploads proof or confirms)
router.post('/confirm-manual', async (req, res) => {
  try {
    const { invoiceNumber, confirmerName, note } = req.body;
    if (!invoiceNumber) return res.status(400).json({ success: false, error: 'Missing invoiceNumber' });

    const payment = await updatePayment(invoiceNumber, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      confirmation: { type: 'manual', confirmerName: confirmerName || 'admin', note: note || '' }
    });

    if (!payment) return res.status(404).json({ success: false, error: 'Invoice not found' });

    const sub = await activateSubscription(payment);
    return res.json({ success: true, invoice: invoiceNumber, subscription: sub });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get payment status
router.get('/status/:invoice', async (req, res) => {
  try {
    const invoice = req.params.invoice;
    const payments = await readJSON(PAYMENTS_FILE, []);
    const payment = payments.find(p => p.invoiceNumber === invoice);
    if (!payment) return res.status(404).json({ success: false, error: 'Invoice not found' });
    return res.json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
