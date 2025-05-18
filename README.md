# 🚀  Dev100X – Upskill Faster, Build Smarter 

[![LinkedIn](https://img.shields.io/badge/-Connect-blue?style=flat-square&logo=linkedin&link=https://www.linkedin.com/in/suraj127021/)](https://www.linkedin.com/in/suraj127021/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Dev100X is a full-stack EdTech platform that helps developers access curated video and document-based courses. It supports both single and bulk lecture uploads, integrates secure payments, and offers a powerful admin panel for course management.

---

## 📸 Demo Preview

> [Watch the demo video here](https://www.linkedin.com/posts/suraj127021_someone-recently-asked-why-i-havent-shared-activity-7328480445514285058-vTP0?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD9N6twBN5tSJvGx0XRTcdYyi81asxQIyyg)

---


## 🔧 Tech Stack

- **Frontend**: React.js, Tailwind CSS, ShadCN UI, Zod  
- **Backend**: Node.js, Express.js, MongoDB Atlas  
- **Cloud & Payments**: Cloudinary, Stripe (testing purpose) 
- **Dev Tools**: NPM, Postman, Notion

---

## 🚀 Features

- 🎓 Create & manage courses and lectures via admin panel  
- 📥 Upload PDFs, videos, Word files — individually or in bulk  
- 💳 Stripe for secure user purchases  
- 🔐 JWT-based user and admin authentication  
- 🖼️ Cloudinary-powered media management  
- 📚 Course preview with PDF/video rendering  
- 🌗 Dark/light mode toggle  
- 💬 Clean UI with modern React architecture

---

## 📁 Directory Structure

```bash
dev100x/
├── backend/
│   ├── config/         # DB, cloud, stripe setup
│   ├── controllers/    # Logic: auth, admin, courses
│   ├── middleware/     # Auth, error, file uploads
│   ├── models/         # MongoDB schemas
│   ├── routes/         # REST API routes
│   ├── utils/          # Helper logic (cloud, stripe, etc.)
│   └── server.js       # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI blocks
│   │   ├── pages/       # Application screens
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API integration
│   │   ├── contexts/    # Global state providers
│   │   ├── lib/         # External utilities
│   │   └── App.tsx      # Root component
│   └── public/          # Static assets
│
├── .env.example         # Sample environment file
├── README.md            # You’re reading it!
└── package.json         # Project metadata
```
---

## 🧪 Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/SURAJ-RATHI/dev100x.git
cd dev100x
```
---
### 2. Install dependencies
# Backend
```bash
cd backend
npm install
```
---

# Frontend
```bash
cd ../frontend
npm install
```
---
### 3. ENV file example(../backend)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string

cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret

JWT_USER_PASSWORD=your_jwt_user_secret
JWT_ADMIN_PASSWORD=your_jwt_admin_secret
NODE_ENV=development
```
---
### 4.🛠️ Running the App
# Start Backend
```bash
npm start
```
---
# Start Frontend
```bash
npm run dev
```
---
Frontend will run on: [http://localhost:5173]([url](http://localhost:5173))

Backend will run on: [http://localhost:5000]([url](http://localhost:5000))

### 5. Future Scope

- 🚀 **User dashboard and course tracking**  
- ⭐ **Ratings, reviews, and Q&A discussion**  
- 🎓 **Certification after course completion**  
- 🔔 **Real-time notifications with WebSockets**  
- 📺 **Live Classes**

---
### 👨‍💻 Author
[Suraj Rathi](https://www.linkedin.com/in/suraj127021)





