# Kitchenly Backend API

A robust Node.js/Express backend API for Kitchenly - a mobile application that connects home chefs with customers, enabling anyone to start their cooking business from home and order high-quality homemade food from local chefs.

## 🚀 Features

- **User Management**: Authentication and authorization for customers, chefs, and admins
- **Menu Items**: CRUD operations for chef menu items with image uploads
- **Order Management**: Complete order lifecycle from creation to completion
- **Real-time Updates**: Socket.IO integration for live order status updates
- **Payment Processing**: Stripe integration for secure payments
- **Geolocation**: PostGIS support for location-based chef discovery
- **Security**: Rate limiting, XSS protection, HPP, helmet, and input sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Payment**: Stripe
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit, XSS sanitization, HPP

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xZeyad11/Kitchenly
   cd Kitchenly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - Express.js and middleware
   - Prisma ORM
   - Swagger documentation tools
   - Security packages
   - And more...

3. **Set up environment variables**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/Kitchenly"
   
   # Stripe Payment Gateway
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
   
   # JWT
   JWT_SECRET="your_jwt_secret_here"
   JWT_EXPIRES_IN="90d"
   
   # Email
   EMAIL_HOST="smtp.example.com"
   EMAIL_PORT=587
   EMAIL_USER="your_email@example.com"
   EMAIL_PASSWORD="your_email_password"
   
   # Server
   PORT=3000
   NODE_ENV="development"
   ```

4. **Set up the database**
   
   Create the PostgreSQL database and enable PostGIS extension:
   ```sql
   CREATE DATABASE Kitchenly;
   \c Kitchenly
   CREATE EXTENSION postgis;
   ```

5. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

7. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot-reload enabled via nodemon.

### Production Mode
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── socket.ts              # Socket.IO configuration
│   ├── common/                # Shared utilities and middleware
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Helper functions
│   ├── modules/               # Feature modules
│   │   ├── user/              # User management
│   │   ├── menuitem/          # Menu item management
│   │   ├── order/             # Order management
│   │   ├── orderitem/         # Order item management
│   │   └── payment/           # Payment processing
│   └── types/                 # TypeScript type definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── uploads/                   # File upload directory
└── dist/                      # Compiled JavaScript output
```

## 📚 API Documentation

### Postman Collection

A comprehensive Postman collection is available in the `postman/` directory:

**Import the collection**: `postman/Kitchenly_API.postman_collection.json`

The Postman collection includes:
- All 28 API endpoints organized by module
- Pre-configured authentication (auto-saves JWT tokens)
- Request examples with sample data
- Support for file uploads
- Environment variables for easy switching between dev/prod

**Quick Start**:
1. Import the collection into Postman
2. Set `baseUrl` variable (default: `http://localhost:3000/api/v1`)
3. Use Signup or Login endpoint (token auto-saves)
4. Test any endpoint with automatic authentication

**Convert to OpenAPI**: The Postman collection can be exported to OpenAPI 3.0 format directly from Postman or using conversion tools.

See `postman/README.md` for detailed instructions.

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### User Routes
- `POST /users/signup` - Register a new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (authenticated)
- `PATCH /users/profile` - Update user profile (authenticated)
- `POST /users/forgot-password` - Request password reset
- `POST /users/reset-password` - Reset password

### Menu Item Routes
- `GET /menuitem` - Get all menu items
- `GET /menuitem/:id` - Get menu item by ID
- `POST /menuitem` - Create menu item (chef only)
- `PATCH /menuitem/:id` - Update menu item (chef only)
- `DELETE /menuitem/:id` - Delete menu item (chef only)

### Order Routes
- `GET /orders` - Get all orders (filtered by role)
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order (customer only)
- `PATCH /orders/:id` - Update order status (chef only)
- `DELETE /orders/:id` - Cancel order

### Payment Routes
- `POST /payment/create-payment-intent` - Create Stripe payment intent
- `POST /payment/webhook` - Stripe webhook handler

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **CUSTOMER**: Can browse menu items, place orders, and manage their orders
- **CHEF**: Can create menu items, manage their menu, and fulfill orders
- **ADMIN**: Full system access

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts with role-based access
- **MenuItem**: Food items offered by chefs
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within an order

See `prisma/schema.prisma` for the complete schema definition.

## 🔒 Security Features

- **Rate Limiting**: 300 requests per hour per IP
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **XSS Protection**: Input sanitization
- **HPP**: HTTP parameter pollution prevention
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication


## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

## 🌐 Socket.IO Events

Real-time communication for order updates:

- `order:created` - New order notification
- `order:updated` - Order status change
- `order:completed` - Order completion notification


