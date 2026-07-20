# GustoSmart - Smart Restaurant Management System

A production-ready, cloud-native full-stack MERN application designed to modernize restaurant operations. Customers can browse menus, book specific tables, place orders, and trace their preparation live, while administrators monitor the kitchen and analytics through a secure control dashboard.

---

## 🚀 Key Modules & Features

1. **User Authentication**: Register and login support using secure password hashing (`bcryptjs`) and stateless `JWT` tokens with role-based restrictions.
2. **Menu Management**: Dynamic search and filtering of menu items. Full CRUD capability for administrators to add, edit, or delete items.
3. **Order Placement & Tracking**: Customers place orders and track their kitchen state live (Pending → Preparing → Ready → Delivered). Active orders are queued in the admin Kitchen Display System (KDS).
4. **Interactive Table Reservation**: Book tables with validations on both client and server to prevent double-booking. Includes an interactive visual seating layout.
5. **Customer Feedback**: Share ratings and comments. Moderation tools allow administrators to view and manage feedback.
6. **Analytics Panel**: Secure administration view loaded with metrics (Sales, orders, bookings) and SVG-based performance charts.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite template), Redux Toolkit (state management), Lucide React (Icons), Vanilla CSS (Glassmorphism & animations)
- **Backend**: Node.js, Express.js (REST APIs, CORS headers, JWT verification)
- **Database**: MongoDB (Mongoose schemas, validations, indexing)
- **Deployment**: Docker containerization, AWS S3 (Frontend), and SSH Remote Action (Backend on Ubuntu VM)

---

## 📂 Project Architecture

```
smart_restaurant_management_system/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection configuration
│   │   ├── controllers/     # Controller layer for all CRUD endpoints
│   │   ├── middleware/      # JWT auth validation & role authorization
│   │   ├── models/          # Mongoose database schemas
│   │   └── routes/          # Express API router setup
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI parts
│   │   ├── features/        # Redux toolkit slices
│   │   ├── pages/           # Customer & Admin pages
│   │   └── store.js         # Redux store config
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # Deploy to AWS S3 & Ubuntu VM Docker
├── postman/
│   └── smart_restaurant_api_collection.json # Postman REST collection
├── docker-compose.yml       # Local database & services stack
└── README.md
```

---

## ⚙️ Local Development

### 1. Prerequisite Setup
Make sure you have [Node.js](https://nodejs.org/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [Git](https://git-scm.com/) installed on your machine.

### 2. Run with Docker Compose (Recommended)
You can build and run the entire stack (Database, API, and Web App) with one command:
```bash
docker-compose up --build
```
- **Frontend App**: Access at `http://localhost`
- **Backend API**: Access at `http://localhost:5000`
- **MongoDB**: Access at `mongodb://localhost:27017`

### 3. Run Manually (Without Docker)

#### Set up and Run Backend:
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start nodemon dev server:
   ```bash
   npm install
   npm run dev
   ```

#### Set up and Run Frontend:
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## 🚢 CI/CD & Cloud Deployment

The repository includes a pre-configured GitHub Actions pipeline inside `.github/workflows/deploy.yml` that triggers on push to the `main` or `arya` branches:

### Frontend (Amazon S3)
- Build outputs (`dist/`) are packaged and synced directly to an **Amazon S3** bucket.
- **Required Secrets in GitHub**:
  - `AWS_ACCESS_KEY_ID`: Your IAM user access key
  - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
  - `AWS_REGION`: e.g. `us-east-1`
  - `AWS_S3_BUCKET`: Target S3 bucket name configured for static site hosting

### Backend (Ubuntu VM via Docker)
- Builds the backend Docker image and pushes it to Docker Hub.
- Connects to your **Ubuntu VM** using SSH and updates the container.
- **Required Secrets in GitHub**:
  - `DOCKER_HUB_USERNAME`: Your Docker registry account username
  - `DOCKER_HUB_TOKEN`: Docker access token
  - `VM_IP`: Public IP of your Ubuntu VM
  - `VM_USERNAME`: VM access username (e.g., `ubuntu` or `root`)
  - `VM_SSH_KEY`: Private SSH Key matching the instance keypair
  - `MONGODB_URI`: Production MongoDB connection URI
  - `JWT_SECRET`: Secret key for signing web tokens

---

## 📬 Postman Collection

Import the pre-configured Postman Collection file located at:
`postman/smart_restaurant_api_collection.json`

It features environment variables (`base_url` pointing to `http://localhost:5000`), pre-configured body models, and test scripts to **automatically extract and attach** the JWT Token upon successful Login/Register requests.