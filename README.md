---
# Book Review API

A production-ready REST API for managing books and reviews with JWT authentication.
---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+
- **MongoDB** (Local instance or connection string )
- **npm**

---

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/book-review.git
   cd book-review
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   touch .env.production .env.development
   ```

4. **Database Setup**

   - Ensure MongoDB is running locally or provide a valid connection string in `DB_URL` inside `.env.development` or `.env.production`.

---

### Running the Application

**Development Mode** (with hot reload using `nodemon`):

```bash
npm run dev
```

**Production Mode**:

```bash
npm run build
npm run start
```

---

## 🔐 Environment Configuration

### Required Variables (.env.development)

```ini
# Application
NODE_ENV=development
PORT=7777
APP_URL=http://localhost:7777

# Database
DB_URL=mongodb://localhost:27017/book-review

# Authentication
JWT_SECRET=your_development_secret_here
JWT_EXPIRE=1d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Production Variables (.env.production)

```ini
# Application
NODE_ENV=production
PORT=80
APP_URL=https://yourdomain.com

# Database
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db-name>

# Authentication
JWT_SECRET=your_strong_production_secret

# Frontend
FRONTEND_URL=https://yourdomain.com
```

---

## 📁 Project Structure

```s
book-review/
├── src/
│   ├── config/          # DB and app configurations
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   └── utils/           # Helper functions
│
├── index.js            # Main app entry point
├── .env                # Environment variables
├── package.json        # Project config
└── README.md           # Documentation
```

---

## 🔐 Key Features

### 1. Authentication System

- **JWT Tokens**: Secure stateless authentication
- **Cookie-based**: HTTP-only cookies for web security
- **Role Management**: User/Admin differentiation

### 2. Production-Grade Middleware

- **Error Handling** (`errorHandler.js`):

  - Catches all errors
  - Returns consistent JSON error responses
  - Logs errors for debugging

- **Authentication** (`auth.js`):

  - Verifies JWT tokens
  - Protects sensitive routes

- **Admin Check** (`admin.js`):
  - Restricts admin-only actions

### 3. Logging System (`logger.js`)

- Timestamped logs
- Separate files for different log levels
- Morgan integration for HTTP request logging

### 4. Security Practices

- Environment variables for secrets
- Password hashing (bcrypt)
- Rate limiting (recommended addition)
- CORS restrictions

---

## 📬 API Examples

### Create Book (Authenticated)

```bash
curl -X POST http://localhost:7777/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Dune",
    "author": "Frank Herbert",
    "genre": "Sci-Fi"
  }'
```

### Add Review

```bash
curl -X POST http://localhost:7777/api/books/BOOK_ID/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 5,
    "reviewText": "Masterpiece of science fiction"
  }'
```

---

## 🚀 Postman Collection

Find ready-to-use API tests in:
`/postman-collections/Book-Review API.postman_collection.json`

Import this into Postman for:

- Pre-configured requests
- Example payloads
- Environment setup

---

## 🧠 Design Decisions

1. **Modular Architecture**

   - Separation of concerns (Routes → Controllers → Models)
   - Easier testing and maintenance

2. **Pagination**

   - Implemented for book lists and reviews
   - Prevents over-fetching

3. **Cascading Deletes**

   - Deleting a book removes all its reviews

4. **Static Methods**
   - Business logic encapsulated in models
   - Example: `Book.search()`

---

## 🔜 Future Improvements

1. Add API documentation (Swagger/OpenAPI)
2. Implement rate limiting
3. Add unit/integration tests
4. Set up CI/CD pipeline
5. Add health check endpoint
