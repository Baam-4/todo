# Todo List App with Authentication

> 🎥 **Demo Video:** [Watch on YouTube]([https://youtu.be/YOUR_VIDEO_ID](https://youtu.be/AjzKpvpjLmI))
>
> <!-- Replace YOUR_VIDEO_ID above with your actual YouTube link -->

A full-stack todo list application with user authentication, built with React, Netlify Functions, and Back4App (Parse Server).

## Features

- **User Authentication**: Secure registration, login, and logout functionality
- **JWT Token-based Authentication**: Stateless authentication with JSON Web Tokens
- **Todo Management**: Create, read, update, and delete todos
- **User-specific Data**: Each user sees only their own todos
- **Responsive Design**: Clean and functional user interface
- **Serverless Backend**: Netlify Functions for API endpoints
- **Cloud Database**: Back4App (Parse Server) for data persistence

## Tech Stack

### Frontend
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **JWT Decode**: Token decoding for user authentication

### Backend
- **Netlify Functions**: Serverless functions for API endpoints
- **Node.js**: Runtime environment
- **Parse SDK**: Back4App integration
- **JWT**: Token generation and verification

### Database
- **Back4App**: Cloud backend based on Parse Server
- **MongoDB**: Underlying database (managed by Back4App)

### Deployment
- **Netlify**: Frontend hosting and serverless functions
- **Git**: Version control

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Back4App Account** (free tier available)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd foregn2c
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Set Up Back4App

1. Create a free account at [back4app.com](https://back4app.com/)
2. Create a new app
3. Go to App Settings → Security & Keys
4. Copy the following credentials:
   - Application ID
   - JavaScript Key
   - Master Key (for server-side operations)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Back4App credentials:

```env
# Back4App Configuration
VITE_PARSE_APPLICATION_ID=your_parse_application_id
VITE_PARSE_JAVASCRIPT_KEY=your_parse_javascript_key
VITE_PARSE_SERVER_URL=https://parseapi.back4app.com

# JWT Secret (for Netlify functions)
JWT_SECRET=your_jwt_secret_key_here

# Netlify will use these in production
PARSE_APPLICATION_ID=your_parse_application_id
PARSE_JAVASCRIPT_KEY=your_parse_javascript_key
PARSE_MASTER_KEY=your_parse_master_key
PARSE_SERVER_URL=https://parseapi.back4app.com
```

**Important**: Generate a secure JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Set Up Back4App Database Schema

In your Back4App dashboard:

1. Go to **Core** → **Classes**
2. Create a new class called `Todo`
3. Add the following columns:
   - `text` (String)
   - `completed` (Boolean)
   - `userId` (String) - This will store the user ID

**Note**: The `User` class is automatically created by Back4App.

## Running the Application

### Development Mode

Run both frontend and Netlify functions locally:

```bash
npm run dev
```

This will start:
- Frontend dev server on `http://localhost:3000`
- Netlify functions on `http://localhost:8888`

### Frontend Only

```bash
cd frontend
npm run dev
```

### Production Build

```bash
npm run build
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /.netlify/functions/auth-register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /.netlify/functions/auth-login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword"
}
```

#### Logout
```http
POST /.netlify/functions/auth-logout
Authorization: Bearer <token>
```

### Todo Endpoints

#### Get Todos
```http
GET /.netlify/functions/todos-get
Authorization: Bearer <token>
```

#### Create Todo
```http
POST /.netlify/functions/todos-create
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Buy groceries"
}
```

#### Update Todo
```http
PUT /.netlify/functions/todos-update
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "todo_id",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /.netlify/functions/todos-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "todo_id"
}
```

## Project Structure

```
foregn2c/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TodoList.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   └── vite.config.js
├── netlify/                 # Netlify configuration
│   └── functions/           # Serverless functions
│       ├── utils.js         # Shared utilities
│       ├── auth-register.js
│       ├── auth-login.js
│       ├── auth-logout.js
│       ├── todos-get.js
│       ├── todos-create.js
│       ├── todos-update.js
│       └── todos-delete.js
├── .env.example             # Environment variables template
├── .gitignore
├── netlify.toml             # Netlify configuration
├── package.json             # Root dependencies
├── README.md                # This file
└── build_steps.md           # Detailed build instructions
```

## Deployment

### Netlify Deployment

1. **Push your code to GitHub**

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   PARSE_APPLICATION_ID=your_application_id
   PARSE_JAVASCRIPT_KEY=your_javascript_key
   PARSE_MASTER_KEY=your_master_key
   PARSE_SERVER_URL=https://parseapi.back4app.com
   JWT_SECRET=your_jwt_secret
   ```

5. **Deploy**
   - Netlify will automatically deploy on push
   - Or trigger manual deploy from dashboard

## Security Considerations

- **JWT Secret**: Use a strong, randomly generated secret in production
- **Environment Variables**: Never commit `.env` files to version control
- **HTTPS**: Always use HTTPS in production (Netlify provides this automatically)
- **Password Security**: Back4App handles password hashing automatically
- **CORS**: Configured to allow requests from your domain
- **User Isolation**: Todos are filtered by user ID to prevent data leakage

## Troubleshooting

### Common Issues

**"Invalid token" error**
- Ensure your JWT_SECRET is consistent between local and production
- Check that the token is being sent in the Authorization header

**Back4App connection errors**
- Verify your Back4App credentials in `.env`
- Check that your Back4App app is active
- Ensure the Parse Server URL is correct

**Netlify functions not working locally**
- Make sure you've run `npm install` in the root directory
- Check that Netlify CLI is installed: `npm install -g netlify-cli`
- Try running `netlify dev` directly

**Build errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (v18+ recommended)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check Back4App documentation: [docs.back4app.com](https://docs.back4app.com)
- Check Netlify documentation: [docs.netlify.com](https://docs.netlify.com)

## Acknowledgments

- Built with [React](https://react.dev)
- Powered by [Netlify](https://netlify.com)
- Backend by [Back4App](https://back4app.com)
- UI styled with custom CSS
