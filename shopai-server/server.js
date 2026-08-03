const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ⚠️ BẮT BUỘC PHẢI KHỞI TẠO app TRƯỚC DÒNG NÀY
const app = express();

app.use(cors());
app.use(express.json());

const PII_SECRET_KEY = process.env.PII_SECRET_KEY || 'SecretKeyBaoMatPII_2026';

// ---------------- 1. API ĐĂNG KÝ (MÃ HÓA PII EMAIL, FULLNAME, PHONE) ----------------
app.post('/api/users/register', async (req, res) => {
  const { email, password, full_name, phone_number } = req.body;

  if (!email || !password || !full_name || !phone_number) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (email, password_hash, full_name, phone_number)
      VALUES (
        pgp_sym_encrypt($1, $5), 
        $2, 
        pgp_sym_encrypt($3, $5), 
        pgp_sym_encrypt($4, $5)
      ) 
      RETURNING user_id, created_at;
    `;

    const values = [
      email.trim().toLowerCase(),
      hashedPassword,
      full_name.trim(),
      phone_number.trim(),
      PII_SECRET_KEY
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      message: 'Đăng ký tài khoản và lưu bảo mật PII thành công!',
      user_id: result.rows[0].user_id
    });

  } catch (err) {
    console.error("Lỗi lưu PII PostgreSQL:", err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký tài khoản.' });
  }
});

// ---------------- 2. API ĐĂNG NHẬP ----------------
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp email và mật khẩu.' });
  }

  try {
    const selectQuery = `
      SELECT 
        user_id,
        password_hash,
        pgp_sym_decrypt(email, $1)::text AS decrypted_email,
        pgp_sym_decrypt(full_name, $1)::text AS full_name
      FROM users;
    `;

    const result = await pool.query(selectQuery, [PII_SECRET_KEY]);
    const user = result.rows.find(u => u.decrypted_email === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    res.json({
      message: 'Đăng nhập thành công!',
      user: {
        user_id: user.user_id,
        email: user.decrypted_email,
        full_name: user.full_name
      }
    });

  } catch (err) {
    console.error("Lỗi API Login:", err);
    res.status(500).json({ error: 'Lỗi máy chủ khi xác thực.' });
  }
});

// ---------------- 3. KHỞI ĐỘNG SERVER ----------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server Backend PostgreSQL đang chạy tại http://localhost:${PORT}`));