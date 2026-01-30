# 🔐 Konfigurasi Pembayaran & Data Rekening

## Data Rekening Penerima Pembayaran

### 🏦 Bank BRI
```
Bank: Bank Rakyat Indonesia
No. Rekening: 428901018765539
Atas Nama: Deni Hendryani Jumara
Jenis Rekening: Tabungan
Status: Aktif ✅
```

### 💰 E-Wallet Dana
```
Aplikasi: Dana
No. HP: 081234446625
Nama: Deni Hendryani Jumara
Status: Aktif ✅
```

### 🚀 GoPay (via Gojek)
```
Aplikasi: Gojek → GoPay
No. HP: 081234446625
Nama: Deni Hendryani Jumara
Status: Aktif ✅
```

### 🌐 PayPal
```
Email: dhjumara78@gmail.com
Currency: USD
Status: Aktif ✅
Conversion Rate: 1 USD ≈ Rp 15.000
```

---

## 💵 Pricing Configuration

### Paket & Harga
```javascript
const pricingConfig = {
  monthly: {
    id: "monthly",
    name: "📅 Satu Bulan",
    price: 50000,           // Rp
    duration: "1 bulan",
    durationDays: 30,
    badge: "Popular",
    order: 1
  },
  yearly: {
    id: "yearly",
    name: "📆 Satu Tahun",
    price: 600000,          // Rp
    duration: "12 bulan",
    durationDays: 365,
    badge: "Best Value",
    savings: 1200000,       // Rp 50k x 12 = 600k, jadi hemat 1.2jt
    order: 2
  },
  vvip: {
    id: "vvip",
    name: "👑 VVIP Selamanya",
    price: 10000000,        // Rp
    duration: "Selamanya",
    durationDays: 36500,    // ~100 tahun
    badge: "ULTIMATE",
    order: 3
  }
};
```

---

## 🔄 Payment Gateway Configuration

### Konversi Mata Uang
```javascript
const currencyConfig = {
  idr: {
    symbol: "Rp",
    decimals: 0,
    locale: "id-ID"
  },
  usd: {
    symbol: "$",
    decimals: 2,
    locale: "en-US",
    rate: 15000  // 1 USD = 15.000 IDR
  }
};
```

### Payment Method Configuration
```javascript
const paymentMethods = {
  bank: {
    id: "bank",
    name: "Transfer Bank BRI",
    icon: "🏦",
    processor: "manual",
    details: {
      bank: "BRI",
      accountNumber: "428901018765539",
      accountHolder: "Deni Hendryani Jumara",
      currency: "IDR"
    },
    confirmationTime: "5-10 menit",
    fee: 0,
    priority: 1
  },
  dana: {
    id: "dana",
    name: "E-Wallet Dana",
    icon: "💰",
    processor: "manual",
    details: {
      app: "Dana",
      phoneNumber: "081234446625",
      accountHolder: "Deni Hendryani Jumara",
      currency: "IDR"
    },
    confirmationTime: "5-10 menit",
    fee: 0,
    priority: 2
  },
  gopay: {
    id: "gopay",
    name: "GoPay",
    icon: "🚀",
    processor: "manual",
    details: {
      app: "Gojek → GoPay",
      phoneNumber: "081234446625",
      accountHolder: "Deni Hendryani Jumara",
      currency: "IDR"
    },
    confirmationTime: "5-10 menit",
    fee: 0,
    priority: 3
  },
  paypal: {
    id: "paypal",
    name: "PayPal International",
    icon: "🌐",
    processor: "paypal",
    details: {
      email: "dhjumara78@gmail.com",
      accountHolder: "Deni Hendryani Jumara",
      currency: "USD"
    },
    confirmationTime: "Instant",
    fee: 2.9,  // Persen
    priority: 4
  }
};
```

---

## 📊 Invoice Configuration

### Invoice Format
```javascript
const invoiceConfig = {
  prefix: "INV",
  dateFormat: "YYYYMMDD",
  randomLength: 4,
  example: "INV-20260129-5678",
  
  // Template
  template: {
    companyName: "AI Media Generator",
    companyEmail: "support@ai-media-generator.com",
    companyPhone: "081234446625",
    website: "https://ai-media-generator.com",
    tax: 0  // PPN 0% untuk sekarang
  }
};
```

---

## 🗓️ Subscription Duration Calculation

### Tanggal Berakhir
```javascript
const getDurationEndDate = (planType) => {
  const now = new Date();
  
  switch(planType) {
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    case 'yearly':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    case 'vvip':
      return new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
    
    default:
      return now;
  }
};
```

---

## 💾 Database Schema (untuk produksi)

```sql
-- Tabel Payments
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  plan_type ENUM('monthly', 'yearly', 'vvip') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  payment_method ENUM('bank', 'dana', 'gopay', 'paypal') NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel Subscriptions
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(100) NOT NULL,
  plan_type ENUM('monthly', 'yearly', 'vvip') NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  payment_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- Tabel Payment Methods
CREATE TABLE payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(100) NOT NULL,
  method_type ENUM('bank', 'dana', 'gopay', 'paypal') NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔐 Environment Variables (.env)

```env
# Payment Configuration
PAYMENT_BANK_ACCOUNT_NUMBER=428901018765539
PAYMENT_BANK_ACCOUNT_NAME=Jumara
PAYMENT_BANK_NAME=BRI

PAYMENT_DANA_PHONE=081234446625
PAYMENT_GOPAY_PHONE=081234446625
PAYMENT_PAYPAL_EMAIL=dhjumara78@gmail.com

# Currency & Exchange Rate
DEFAULT_CURRENCY=IDR
USD_TO_IDR_RATE=15000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ai-media-generator.com

# Webhook Configuration
PAYMENT_WEBHOOK_SECRET=your-secret-key-here
PAYMENT_WEBHOOK_TIMEOUT=30000

# Features
ENABLE_AUTO_PAYMENT_CONFIRMATION=false
MANUAL_PAYMENT_APPROVAL_REQUIRED=true
```

---

## 📨 Email Templates

### Lokasi File
```
/public/email-templates/
  ├── order-confirmation.html
  ├── payment-received.html
  ├── subscription-activated.html
  ├── renewal-reminder.html
  └── invoice.html
```

### Contoh Order Confirmation
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #6366f1; color: white; padding: 20px; }
    .content { padding: 20px; }
    .price { font-size: 24px; font-weight: bold; color: #6366f1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pesanan Langganan Berhasil</h1>
    </div>
    <div class="content">
      <p>Terima kasih telah memilih {{ PLAN_NAME }}!</p>
      <p><strong>Invoice:</strong> {{ INVOICE_NUMBER }}</p>
      <p><strong>Harga:</strong> <span class="price">{{ AMOUNT }}</span></p>
      <p>Instruksi pembayaran telah dikirim ke email ini.</p>
    </div>
  </div>
</body>
</html>
```

---

## 🧪 Testing Checklist

- [ ] Test Bank Transfer payment flow
- [ ] Test Dana payment flow
- [ ] Test GoPay payment flow
- [ ] Test PayPal payment flow
- [ ] Test invoice generation
- [ ] Test subscription activation
- [ ] Test email notifications
- [ ] Test payment history
- [ ] Test refund process
- [ ] Test manual payment confirmation

---

## 📈 Monitoring & Analytics

### Metrics untuk Ditrack
- Total revenue per plan type
- Conversion rate
- Most popular payment method
- Failed payment percentage
- Average payment confirmation time

---

**Versi:** 1.0  
**Last Updated:** 29 January 2026  
**Status:** ✅ Complete
