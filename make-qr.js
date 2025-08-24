// make-qr.js
// Tạo QR PNG trỏ đến GitHub Pages của repo quanitdev/QR_Q
// Cách dùng:
//   node make-qr.js                -> tạo 1 mã ngẫu nhiên
//   node make-qr.js HNOSS-2025     -> tạo 1 mã cụ thể
//   node make-qr.js A B C          -> tạo nhiều QR cho nhiều mã

const fs = require('fs');
const path = require('path');
const QR = require('qrcode');

// ==== TÙY CHỈNH TÀI KHOẢN/REPO TẠI ĐÂY ====
const USER = 'quanitdev';
const REPO = 'QR_Q';
// Nếu bạn có custom domain cho Pages, đặt BASE_URL = 'https://yourdomain/...'
const BASE_URL = process.env.BASE_URL || `https://${USER}.github.io/${REPO}/`;
// ==========================================

function randomCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
function sanitizeFileName(s) {
  return s.replace(/[^a-z0-9_-]/gi, '_');
}

async function makeOne(code) {
  const url = `${BASE_URL}?code=${encodeURIComponent(code)}`;
  const file = `qr-${sanitizeFileName(code)}.png`;
  await QR.toFile(file, url, { width: 512, margin: 2 });
  console.log('✅ Đã tạo:', file);
  console.log('🔗 URL   :', url);
}

(async () => {
  try {
    const args = process.argv.slice(2);
    const codes = args.length ? args : [randomCode()];

    // Tạo thư mục output (tùy chọn)
    const outDir = '.';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    process.chdir(outDir);

    for (const c of codes) {
      await makeOne(c);
    }
    console.log('\nTip: dán URL vào trình duyệt để xem badge "Mã đã chạy".');
  } catch (e) {
    console.error('❌ Lỗi tạo QR:', e);
    process.exit(1);
  }
})();
