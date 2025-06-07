# 🚀 Resume Project – Node.js + Nginx + HTML

This is a simple, production-ready Node.js project designed to serve a professional resume webpage using Express.js and optionally reverse-proxied with Nginx for enhanced performance and SSL termination.

---

## 🌐 Live Demo

You can view the live site at: [https://sushilswarnkar.info](https://sushilswarnkar.info)

---

## 📁 Project Structure

```
resume-project/
├── public/                 # Static HTML/CSS/JS files (your resume page)
├── server.js              # Main Express.js server
├── package.json
└── README.md
```

---

## 💠 Technologies Used

* **Node.js** & **Express.js** – to serve the static HTML page.
* **Nginx** – as a reverse proxy and SSL terminator (optional).
* **Let's Encrypt (Certbot)** – for free HTTPS.
* **GitHub Actions** (optional) – for CI/CD automation.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:SushilSwarnkar/resume-project.git
cd resume-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
node server.js
```

The site should now be accessible at: `http://localhost:3000`

---

## 🌍 Nginx Configuration (Optional)

Use Nginx as a reverse proxy to forward traffic from port 80/443 to your Node.js server:

```nginx
server {
    listen 80;
    server_name yourdomain.com  www.yourdomain.com

    return 301 https://yourdomain.com$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location = /Resume_Sushil_SenDevOps.pdf {
        deny all;
        return 403;
    }
}
```

---

## 🔐 Security

* 🔐 HTTPS is enabled with Let's Encrypt.
* 📄 Direct access to the resume PDF file is **blocked** using Nginx rules.
* 📧 Resume download is protected by an email OTP verification functionality to ensure authorized access.
* ✅ Code is scanned using [Gitleaks](https://github.com/gitleaks/gitleaks) to ensure no secrets are committed.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙇‍♂️ Author

**Sushil Swarnkar**
[LinkedIn](https://linkedin.com/in/sushil-swarnkar) • [GitHub](https://github.com/SushilSwarnkar)
