# 🧪 Payment System Testing Guide

## Pre-Testing Checklist

- [ ] Browser yang digunakan adalah yang terbaru (Chrome, Firefox, Edge)
- [ ] JavaScript enabled di browser
- [ ] localStorage tidak disable
- [ ] Developer Tools siap (F12)
- [ ] Clear browser cache sebelum testing

---

## 📋 Manual Testing Scenarios

### Test Case 1: View Pricing Page

**Steps:**
1. Buka aplikasi di browser
2. Klik menu **"💳 Langganan"** di navbar

**Expected Result:**
- ✅ Pricing section muncul
- ✅ 3 paket ditampilkan dengan layout yang benar
- ✅ Harga terformat dengan benar (Rp X.XXX.XXX)
- ✅ Badge "Popular", "Best Value", "ULTIMATE" muncul
- ✅ Deskripsi fitur setiap paket terbaca

**Actual Result:** _______________

---

### Test Case 2: Select Monthly Plan

**Steps:**
1. Di Pricing page, klik tombol "Pilih Paket" pada paket Satu Bulan
2. Amati Payment Modal yang muncul

**Expected Result:**
- ✅ Payment modal muncul
- ✅ Summary menampilkan "📅 Satu Bulan"
- ✅ Harga menampilkan "Rp 50.000"
- ✅ 4 metode pembayaran tersedia
- ✅ Tidak ada metode pembayaran yang ter-select awal

**Actual Result:** _______________

---

### Test Case 3: Select Yearly Plan

**Steps:**
1. Kembali ke Pricing page (klik tombol Batal)
2. Klik tombol "Pilih Paket" pada paket Satu Tahun
3. Amati Payment Modal

**Expected Result:**
- ✅ Payment modal muncul
- ✅ Summary menampilkan "📆 Satu Tahun"
- ✅ Harga menampilkan "Rp 600.000"
- ✅ Hemat amount tidak ditampilkan di modal (hanya di pricing page)

**Actual Result:** _______________

---

### Test Case 4: Select VVIP Plan

**Steps:**
1. Kembali ke Pricing page
2. Scroll ke bawah untuk melihat paket VVIP
3. Klik tombol "Aktifkan VVIP"
4. Amati Payment Modal

**Expected Result:**
- ✅ Payment modal muncul
- ✅ Summary menampilkan "👑 VVIP Selamanya"
- ✅ Harga menampilkan "Rp 10.000.000"

**Actual Result:** _______________

---

### Test Case 5: Select Bank Transfer Payment

**Steps:**
1. Dari Payment Modal, klik pada option "🏦 Transfer Bank BRI"
2. Amati perubahan UI

**Expected Result:**
- ✅ Border payment method berubah warna menjadi biru
- ✅ Background payment method berubah menjadi transparan biru
- ✅ Radio button ter-select otomatis
- ✅ Bank details section muncul menampilkan:
  - Bank: BRI
  - No. Rekening: 428901018765539 (a.n. Deni Hendryani Jumara)
  - Atas Nama: Deni Hendryani Jumara
  - Nominal transfer yang benar
- ✅ Text deskripsi pembayaran terlihat jelas

**Actual Result:** _______________

---

### Test Case 6: Select Dana Payment

**Steps:**
1. Dari Payment Modal, klik pada option "💰 E-Wallet Dana"
2. Amati perubahan UI

**Expected Result:**
- ✅ Dana payment method ter-select
- ✅ Bank details hilang
- ✅ Dana details section muncul menampilkan:
  - Aplikasi: Dana
  - No. HP: 081234446625 (a.n. Deni Hendryani Jumara)
  - Nominal yang benar
- ✅ Instruksi pembayaran jelas

**Actual Result:** _______________

---

### Test Case 7: Select GoPay Payment

**Steps:**
1. Dari Payment Modal, klik pada option "🚀 GoPay"
2. Amati perubahan UI

**Expected Result:**
- ✅ GoPay payment method ter-select
- ✅ Dana details hilang
- ✅ GoPay details section muncul menampilkan:
  - Aplikasi: Gojek → GoPay
  - No. HP: 081234446625 (a.n. Deni Hendryani Jumara)
  - Nominal yang benar
- ✅ Instruksi menggunakan GoPay jelas

**Actual Result:** _______________

---

### Test Case 8: Select PayPal Payment

**Steps:**
1. Dari Payment Modal, klik pada option "🌐 PayPal International"
2. Amati perubahan UI

**Expected Result:**
- ✅ PayPal payment method ter-select
- ✅ GoPay details hilang
- ✅ PayPal details section muncul menampilkan:
  - Email: dhjumara78@gmail.com (a.n. Deni Hendryani Jumara)
  - Nominal dalam USD (Rp ÷ 15000)
  - Tombol "Buka PayPal"
- ✅ Nilai USD terkonversi dengan benar
  - Rp 50.000 = USD 3.33
  - Rp 600.000 = USD 40.00
  - Rp 10.000.000 = USD 666.67

**Actual Result:** _______________

---

### Test Case 9: Confirm Payment (Bank Transfer)

**Steps:**
1. Select paket "Satu Bulan" (Rp 50.000)
2. Select metode "Transfer Bank BRI"
3. Klik tombol "✓ Konfirmasi Pembayaran"

**Expected Result:**
- ✅ Alert notifikasi muncul dengan text:
  "✅ Pembayaran sedang diproses. Invoice: INV-YYYYMMDD-XXXX"
- ✅ Alert notification hilang setelah 4 detik
- ✅ Payment Modal tertutup
- ✅ Kembali ke halaman Pricing
- ✅ Console log menampilkan:
  - Payment Data: {...}
  - Payment Method Details: {...}

**Actual Result:** _______________

---

### Test Case 10: Confirm Payment (PayPal)

**Steps:**
1. Select paket "Satu Tahun" (Rp 600.000)
2. Select metode "PayPal International"
3. Klik tombol "Buka PayPal"
4. Amati window/tab baru yang terbuka

**Expected Result:**
- ✅ PayPal tab baru membuka
- ✅ URL berisi email: dhjumara78@gmail.com
- ✅ URL berisi amount: 40.00 (USD)
- ✅ Format URL: https://www.paypal.com/paypalme/dhjumara78/40.00
- ✅ Tab utama masih terbuka

**Actual Result:** _______________

---

### Test Case 11: Error Handling - No Payment Method Selected

**Steps:**
1. Select paket apapun (modal muncul)
2. Langsung klik tombol "✓ Konfirmasi Pembayaran" tanpa select metode
3. Amati error message

**Expected Result:**
- ✅ Alert error muncul:
  "❌ Silakan pilih metode pembayaran terlebih dahulu"
- ✅ Alert berwarna merah/error style
- ✅ Payment Modal tidak tertutup
- ✅ User bisa memilih metode pembayaran

**Actual Result:** _______________

---

### Test Case 12: localStorage Data Verification

**Steps:**
1. Lakukan Test Case 9 (confirm payment)
2. Buka Developer Tools (F12)
3. Go to Application → localStorage
4. Check "payments" dan "subscription" keys

**Expected Result:**
- ✅ Key "payments" ada
- ✅ Value berupa array JSON
- ✅ Bisa expand untuk lihat detail
- ✅ Data include:
  - planType: "monthly"
  - planName: "📅 Satu Bulan"
  - price: 50000
  - paymentMethod: "bank"
  - invoiceNumber: INV-YYYYMMDD-XXXX
  - timestamp
  - status: "pending"
- ✅ Key "subscription" ada
- ✅ Value include:
  - planType: "monthly"
  - status: "active"
  - expiresAt: 1 bulan dari sekarang
  - activatedAt

**Actual Result:** _______________

**localStorage Content:**
```json
// Paste hasil dari console di sini
```

---

### Test Case 13: Invoice Number Generation

**Steps:**
1. Lakukan multiple confirms (Test Case 9) dengan rencana berbeda
2. Catat invoice numbers yang di-generate
3. Verifikasi format

**Expected Result:**
- ✅ Format: INV-YYYYMMDD-XXXX
- ✅ Contoh: INV-20260129-1234
- ✅ Setiap transaksi memiliki invoice unik
- ✅ Date bagian sesuai tanggal sekarang
- ✅ Random 4-digit number berbeda setiap kali

**Actual Result:**

| Invoice 1 | Invoice 2 | Invoice 3 |
|-----------|-----------|-----------|
| _________ | _________ | _________ |

---

### Test Case 14: Modal Close Button

**Steps:**
1. Buka Payment Modal (klik pilih paket)
2. Klik tombol "✕" (close button) di kanan atas modal

**Expected Result:**
- ✅ Modal tertutup
- ✅ Kembali ke Pricing page
- ✅ Tidak ada data yang tersimpan

**Actual Result:** _______________

---

### Test Case 15: Modal Cancel Button

**Steps:**
1. Buka Payment Modal
2. Select payment method
3. Klik tombol "Batal"

**Expected Result:**
- ✅ Modal tertutup
- ✅ Kembali ke Pricing page
- ✅ Tidak ada data yang tersimpan
- ✅ Payment method selection ter-reset

**Actual Result:** _______________

---

## 🔍 Console Testing

### Check Errors
```javascript
// Buka Developer Tools (F12)
// Go to Console tab
// Catat semua error/warning yang muncul

Errors Found:
_______________________________________________
_______________________________________________
```

### Check Network Requests
```javascript
// Go to Network tab
// Lakukan confirm payment
// Verifikasi tidak ada failed requests

Request Status:
_______________________________________________
```

### Test Functions in Console
```javascript
// Di console, jalankan commands ini:

// Test 1: Check current plan
console.log('currentPlan:', currentPlan);

// Test 2: Check payment history
console.log('payments:', JSON.parse(localStorage.getItem('payments')));

// Test 3: Check subscription
console.log('subscription:', JSON.parse(localStorage.getItem('subscription')));

// Test 4: Generate invoice
console.log('invoice:', generateInvoiceNumber());

// Test 5: Get payment details
console.log('bank details:', getPaymentDetails('bank'));
```

---

## 📱 Responsiveness Testing

### Desktop (1920x1080)
- [ ] Pricing cards layout benar
- [ ] Payment modal centered
- [ ] Text readable
- [ ] Buttons accessible

### Tablet (768x1024)
- [ ] Pricing cards responsive
- [ ] Payment modal fit di layar
- [ ] Scrolling smooth

### Mobile (375x667)
- [ ] Pricing cards stacked
- [ ] Payment modal full width dengan margin
- [ ] Buttons mudah diklik
- [ ] Text tidak terpotong

---

## 🌐 Browser Compatibility Testing

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ⬜ | _____________ |
| Firefox | Latest | ⬜ | _____________ |
| Edge | Latest | ⬜ | _____________ |
| Safari | Latest | ⬜ | _____________ |

---

## 📊 Performance Testing

```javascript
// Measure function execution time
console.time('selectPlan');
selectPlan('monthly', 50000);
console.timeEnd('selectPlan');

// Expected: < 100ms
Actual Time: _________
```

---

## 🔒 Security Testing

- [ ] Inspect element tidak bisa modify price
- [ ] localStorage data tidak bisa tamper
- [ ] Console tidak expose sensitive data
- [ ] XSS injection tidak bekerja
- [ ] CSRF protection (untuk backend)

---

## ✅ Sign-Off

| Tester | Date | Status |
|--------|------|--------|
| _____________________ | _____ | ⬜ Approved / ⬜ Rejected |
| _____________________ | _____ | ⬜ Approved / ⬜ Rejected |
| _____________________ | _____ | ⬜ Approved / ⬜ Rejected |

**Notes/Issues Found:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## 🐛 Bug Report Template

### Bug #1
**Severity:** ⬜ Critical / ⬜ High / ⬜ Medium / ⬜ Low
**Title:** _________________________________
**Description:** _________________________________
**Steps to Reproduce:** _________________________________
**Expected Result:** _________________________________
**Actual Result:** _________________________________
**Screenshot/Video:** _________________________________

---

**Testing Version:** 1.0  
**Date:** 29 January 2026  
**Tester:** _______________________
