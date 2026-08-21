const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup for Gmail (Port 465 to bypass firewall blocking 587)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/api/send-otp', async (req, res) => {
  const { to_email, to_name, otp_code } = req.body;

  if (!to_email || !otp_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"TrueStyle Security" <${process.env.GMAIL_USER}>`,
    to: to_email,
    subject: 'Your TrueStyle OTP Verification Code',
    text: `Hello ${to_name || 'User'},\n\nYour 6-digit TrueStyle verification code is: ${otp_code}\n\nPlease enter this code to complete your registration.\n\nThank you,\nTrueStyle Security`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; padding: 20px;">
             <h2 style="color: #4CAF50; text-align: center;">TrueStyle Security</h2>
             <p>Hello ${to_name || 'User'},</p>
             <p>Your secure verification code is:</p>
             <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #333; margin: 20px 0;">${otp_code}</div>
             <p>Please enter this code in the TrueStyle app to complete your registration.</p>
             <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
           </div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully to:', to_email, 'MessageID:', info.messageId);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP email', details: error.message });
  }
});

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    // Add realistic headers to bypass simple bot protections
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000 // 10 seconds timeout
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract Product Name
    let title = $('meta[property="og:title"]').attr('content') 
      || $('title').text() 
      || $('h1').first().text() 
      || '';
      
    // Clean up title (remove " | Adidas IN" etc)
    title = title.split('|')[0].split('-')[0].trim();

    // Extract Price
    let priceStr = $('meta[property="og:price:amount"]').attr('content')
      || $('meta[property="product:price:amount"]').attr('content')
      || $('.price').first().text()
      || $('.current-price').first().text()
      || $('[data-test="product-price"]').first().text()
      || '';
      
    let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(price) || price === 0) price = null;

    // Extract Image
    let image = $('meta[property="og:image"]').attr('content')
      || $('meta[name="twitter:image"]').attr('content')
      || $('img').first().attr('src')
      || null;

    // Extract Description
    let description = $('meta[property="og:description"]').attr('content')
      || $('meta[name="description"]').attr('content')
      || null;

    // Ensure image URL is absolute
    if (image && !image.startsWith('http')) {
      try {
        const baseUrl = new URL(url).origin;
        image = new URL(image, baseUrl).href;
      } catch (e) {}
    }

    res.status(200).json({ 
      success: true, 
      data: {
        title: title || null,
        price: price || null,
        image: image,
        description: description
      }
    });

  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ 
      error: 'Failed to scrape URL', 
      details: error.message,
      status: error.response ? error.response.status : null 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
