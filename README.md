# SwapStore - Full Stack E-commerce Platform

SwapStore is a modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a smooth shopping experience with features like user authentication, product management, order processing, and many more.

## 🚀 Features

- **User Authentication**

  - Secure login and registration
  - JWT-based authentication
  - Password encryption
  - Session management

- **Product Management**

  - Product listing and search
  - Product categories
  - Image upload with Cloudinary
  - Product details and reviews

- **Shopping Experience**

  - Shopping cart functionality
  - Order processing
  - Payment integration
  - Order tracking

- **User Dashboard**
  - Profile management
  - Order history
  - Wishlist
  - Address management

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- React Query
- React Router DOM
- Formik & Yup
- Tailwind CSS
- Axios
- Zustand (State Management)
- React Hot Toast
- Swiper
- Moment.js & Date-fns

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer
- Nodemailer
- Bcrypt
- Cookie Parser
- CORS

## 📦 Installation

1. Clone the repository

```bash
git clone https://github.com/4thQ/SwapStore.git
cd SwapStore
```

2. Install Backend Dependencies

```bash
cd backend
npm install
```

3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

4. Environment Setup

Backend (.env):

```
PORT=5000
```


## 🚀 Running the Application

1. Start Backend Server

```bash
cd backend
npm run dev
```

2. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

## 📚 How to Use

### Authentication

1. **Sign Up**

   - Navigate to the registration page
   - Fill in your details (name, email, password)
   - Upload a profile picture (optional)
   - Click "Sign Up"

2. **Sign In**

   - Enter your email and password
   - Click "Sign In"
   - You'll receive a JWT token for authentication

3. **Profile Management**
   - Update your profile information
   - Change your profile picture
   - Manage your addresses

### Product Management

1. **Adding Items**

   - Click "Add Item" in the dashboard
   - Fill in item details (name, description, price, category)
   - Upload up to 5 images
   - Set item condition and availability

2. **Managing Items**

   - View your listed items
   - Edit item details
   - Delete items
   - Mark items as sold

3. **Wishlist**
   - Add items to wishlist
   - Remove items from wishlist
   - View your wishlist

### Shopping

1. **Browsing**

   - Browse all items
   - Filter by category
   - Search items
   - View recent items
   - Check seller profiles

2. **Orders**
   - Place buy orders
   - Place rent orders
   - Initiate swap requests
   - Track order status
   - View order history

## 🔌 API Endpoints

### Authentication

- `POST /api/signin` - User login
- `POST /api/signup` - User registration
- `POST /api/update-profile` - Update user profile
- `GET /api/self` - Get current user info
- `GET /api/refresh-tokens` - Refresh authentication tokens
- `POST /api/logout` - User logout

### Items

- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Edit item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items` - Get all items
- `GET /api/items/my-items` - Get user's items
- `GET /api/items/recents` - Get recent items
- `GET /api/items/details/:id` - Get item details
- `GET /api/items/seller` - Get seller's items
- `POST /api/items/wishlists` - Toggle wishlist
- `GET /api/items/wishlists` - Get wishlist

### Orders

- `POST /api/orders/buy` - Place buy order
- `POST /api/orders/rent` - Place rent order
- `POST /api/orders/swap` - Place swap order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/my-sales` - Get user's sales
- `PUT /api/orders/update` - Update order status
- `GET /api/orders/notifications` - Get notifications
- `GET /api/orders/notifications/markAsRead` - Mark notifications as read


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch 
3. Commit your changes 
4. Push to the branch 
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Nirajan Gurung - 

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image hosting
- Vercel for deployment
