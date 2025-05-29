```markdown
# Book Review API

A production-ready REST API for managing books and reviews with JWT authentication.

## 📁 Project Structure
```

```plaintext
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

## 🛠️ Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/book-review-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   touch .env.development .env.production
   ```

4. Start the server:

   ```bash
   npm run dev   # Development mode
   npm run prod  # Production mode
   ```

---

## 🌐 API Endpoints

| Method | Endpoint                 | Description                | Auth Required |
| ------ | ------------------------ | -------------------------- | ------------- |
| POST   | `/auth/signup`           | User registration          | No            |
| POST   | `/auth/login`            | User login                 | No            |
| GET    | `/auth/me`               | Get current user           | Yes           |
| POST   | `/auth/logout`           | User logout                | Yes           |
| POST   | `/api/books`             | Create new book            | Yes           |
| GET    | `/api/books`             | Get all books (paginated)  | No            |
| GET    | `/api/books/search`      | Search books               | No            |
| GET    | `/api/books/:id`         | Get book details + reviews | No            |
| DELETE | `/api/books/:id`         | Delete book                | Admin Only    |
| POST   | `/api/books/:id/reviews` | Add review                 | Yes           |
| PUT    | `/api/reviews/:id`       | Update review              | Owner Only    |
| DELETE | `/api/reviews/:id`       | Delete review              | Owner Only    |
| GET    | `/api/reviews/me`        | Get current user's reviews | Yes           |

---

## 🗃️ Database Schema

### Models Overview

**User (`user.js`)**

```javascript
{
  firstName: String,
  lastName: String,
  email: String,    // Unique
  password: String, // Hashed
  role: String,     // 'user' or 'admin'
  timestamps: true
}
```

**Book (`book.js`)**

```javascript
{
  title: String,
  author: String,
  genre: String,
  publishedYear: Number,
  description: String,
  createdBy: ObjectId, // Reference to User
  timestamps: true
}
```

**Review (`review.js`)**

```javascript
{
  bookId: ObjectId,  // Reference to Book
  userId: ObjectId,  // Reference to User
  rating: Number,    // 1-5
  reviewText: String,
  timestamps: true
}
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
`/postman-collections/Book-API.postman_collection.json`

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

```

```
