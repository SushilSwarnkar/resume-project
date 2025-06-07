const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files (index.html, images)

// In-memory OTP storage (use Redis or database in production)
const otps = new Map();

// Email configuration (replace with your credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use SendGrid, AWS SES, etc.
    auth: {
        user: 'sushilsoni2407@gmail.com', // Your email
        pass: '$PASS' // Gmail App Password (not regular password)
    }
});

// Generate 6-digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    const otp = generateOTP();
    otps.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5-minute expiry

    const mailOptions = {
        from: 'your.email@gmail.com',
        to: email,
        subject: 'Resume Download OTP',
        text: `Your OTP for downloading Sushil Swarnkar's resume is ${otp}. It expires in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const stored = otps.get(email);

    if (!stored) {
        return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (stored.expires < Date.now()) {
        otps.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (stored.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    otps.delete(email); // Clear OTP after successful verification
    res.json({ message: 'OTP verified successfully' });
});

// Serve PDF after verification
app.get('/api/download-resume', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Resume_Sushil_SenDevOps.pdf');
    res.download(filePath, 'Sushil_Swarnkar_Resume.pdf', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading resume');
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
