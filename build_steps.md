# Build and Setup Steps

This document provides detailed step-by-step instructions for setting up, building, and deploying the Todo List application.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Backend Configuration](#backend-configuration)
3. [Frontend Configuration](#frontend-configuration)
4. [Back4App Setup](#back4app-setup)
5. [Environment Variables](#environment-variables)
6. [Development](#development)
7. [Production Build](#production-build)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Initial Setup

### Prerequisites Check

Ensure you have the following installed:

```bash
# Check Node.js version (should be v18 or higher)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

If Node.js is not installed or version is too old:
- Download from [nodejs.org](https://nodejs.org/)
- Or use nvm (Node Version Manager):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 18
  nvm use 18
  ```

### Clone and Navigate

```bash
# Clone the repository
git clone <your-repository-url>
cd foregn2c

# Verify project structure
ls -la
```

Expected structure:
```
foregn2c/
├── frontend/
├── netlify/
├── .env.example
├── .gitignore
├── netlify.toml
├── package.json
└── README.md
```

### Install Root Dependencies

```bash
# Install root package dependencies
npm install

# Verify installation
ls node_modules
```

This installs:
- `jsonwebtoken` - JWT token generation/verification
- `parse` - Back4App Parse SDK
- `netlify-cli` - Netlify development tools
- `concurrently` - Run multiple commands simultaneously

## Backend Configuration

### Netlify Functions Setup

The backend is configured as Netlify serverless functions. The structure is already set up in `netlify/functions/`.

```bash
# Verify Netlify functions structure
ls -la netlify/functions/
```

Expected files:
- `utils.js` - Shared utilities (Parse config, JWT helpers)
- `auth-register.js` - User registration
- `auth-login.js` - User login
- `auth-logout.js` - User logout
- `todos-get.js` - Fetch todos
- `todos-create.js` - Create todo
- `todos-update.js` - Update todo
- `todos-delete.js` - Delete todo

### Verify Netlify Configuration

Check `netlify.toml`:

```bash
cat netlify.toml
```

Expected configuration:
```toml
[build]
  command = "cd frontend && npm run build"
  publish = "frontend/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"

[dev]
  command = "cd frontend && npm run dev"
  port = 3000
  targetPort = 3000
  publish = "frontend/dist"
  autoLaunch = false
```

## Frontend Configuration

### Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

This installs:
- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `jwt-decode` - JWT token decoding
- `vite` - Build tool

### Verify Frontend Structure

```bash
ls -la frontend/src/
```

Expected structure:
```
frontend/src/
├── components/
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── TodoList.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Back4App Setup

### Create Back4App Account

1. Visit [back4app.com](https://back4app.com/)
2. Click "Sign Up" (free tier available)
3. Complete registration
4. Verify email if required

### Create New App

1. Log in to Back4App dashboard
2. Click "Build" → "Create a new app"
3. Choose a name (e.g., "todo-app")
4. Select "NoSQL" as database type
5. Click "Create"

### Get App Credentials

1. In your app dashboard, go to **App Settings** → **Security & Keys**
2. Copy the following credentials:
   - **Application ID**
   - **JavaScript Key**  
   - **Master Key** (needed for server-side operations)

Example:
```
Application ID: abc123xyz456
JavaScript Key: def789ghi012
Master Key: mno345pqr678
```

### Set Up Database Schema

1. In Back4App dashboard, go to **Core** → **Classes**
2. Click "Create a class"
3. Name it `Todo`
4. Add the following columns:
   - Click "Add a new column"
   - Name: `text`, Type: String
   - Name: `completed`, Type: Boolean
   - Name: `userId`, Type: String

5. Verify the class structure:
   ```
   Todo Class:
   - text (String)
   - completed (Boolean)
   - userId (String)
   - createdAt (DateTime) - auto
   - updatedAt (DateTime) - auto
   - objectId (String) - auto
   - ACL (ACL) - auto
   ```

**Note**: The `User` class is automatically created by Back4App.

### Configure Class Level Permissions (Optional but Recommended)

1. Go to **Core** → **Classes** → **Todo**
2. Click "Class Level Permissions"
3. Set the following:
   - **Find**: `Public` (or restrict to authenticated users)
   - **Get**: `Public`
   - **Create**: `Public`
   - **Update**: `Public`
   - **Delete**: `Public`

**Security Note**: In production, you might want to restrict these to authenticated users only.

## Environment Variables

### Generate JWT Secret

Generate a secure random string for JWT signing:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (e.g., `a1b2c3d4e5f6...`)

### Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit the file
nano .env  # or use your preferred editor
```

### Configure Environment Variables

Edit `.env` with your actual credentials:

```env
# Back4App Configuration
VITE_PARSE_APPLICATION_ID=your_actual_application_id
VITE_PARSE_JAVASCRIPT_KEY=your_actual_javascript_key
VITE_PARSE_SERVER_URL=https://parseapi.back4app.com

# JWT Secret (use the generated secret from above)
JWT_SECRET=your_generated_jwt_secret_here

# Netlify will use these in production
PARSE_APPLICATION_ID=your_actual_application_id
PARSE_JAVASCRIPT_KEY=your_actual_javascript_key
PARSE_MASTER_KEY=your_actual_master_key
PARSE_SERVER_URL=https://parseapi.back4app.com
```

**Important**:
- Replace all placeholder values with your actual Back4App credentials
- Use the generated JWT secret
- Never commit `.env` to version control (it's in `.gitignore`)

### Verify Environment Setup

```bash
# Check that .env exists
ls -la .env

# Verify it's not tracked by git
git status
```

## Development

### Local Development with Netlify CLI

#### Install Netlify CLI (if not already installed)

```bash
npm install -g netlify-cli
```

#### Start Development Server

```bash
# From project root
npm run dev
```

This starts:
- Frontend dev server on `http://localhost:3000`
- Netlify functions on `http://localhost:8888`

#### Alternative: Start Separately

```bash
# Terminal 1: Frontend only
cd frontend
npm run dev

# Terminal 2: Netlify functions only
netlify dev
```

### Development Workflow

1. **Make code changes**
2. **Save files** (Vite has hot module replacement)
3. **Test changes** in browser at `http://localhost:3000`
4. **Check console** for errors

### Testing the Application

#### Test Registration

1. Navigate to `http://localhost:3000/register`
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Register"
4. Should redirect to `/todos`

#### Test Login

1. Navigate to `http://localhost:3000/login`
2. Fill in:
   - Username: `testuser`
   - Password: `password123`
3. Click "Login"
4. Should redirect to `/todos`

#### Test Todo Operations

1. **Add Todo**:
   - Type "Buy groceries" in the input
   - Click "Add"
   - Todo should appear in the list

2. **Complete Todo**:
   - Click the checkbox next to a todo
   - Todo should be marked as completed (strikethrough)

3. **Delete Todo**:
   - Click "Delete" button
   - Todo should be removed from the list

#### Test Logout

1. Click "Logout" button
2. Should redirect to `/login`
3. Try to access `/todos` directly - should redirect to login

### Debugging

#### Check Netlify Functions Logs

```bash
# In another terminal
netlify functions:logs
```

#### Browser Console

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls

#### Back4App Dashboard

1. Go to Back4App dashboard
2. Check **Core** → **Classes** → **Todo** to see data
3. Check **Core** → **Classes** → **User** to see users

## Production Build

### Build Frontend

```bash
# From project root
npm run build
```

This creates an optimized production build in `frontend/dist/`.

### Verify Build

```bash
# Check that dist directory was created
ls -la frontend/dist/

# Expected output:
# index.html
# assets/ (with JS and CSS files)
```

### Test Production Build Locally

```bash
cd frontend
npm run preview
```

This serves the production build locally for testing.

## Deployment

### Prepare for Deployment

#### Verify Git Status

```bash
git status
```

Ensure:
- `.env` is not committed (should be in `.gitignore`)
- All changes are staged/committed
- Build artifacts are not committed

#### Create .gitignore (if not exists)

Verify `.gitignore` contains:
```
node_modules/
.env
.env.local
.netlify/
dist/
build/
```

### Deploy to Netlify

#### Option 1: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Import an existing project"
   - Select GitHub
   - Authorize Netlify to access your repository
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
   - Click "Deploy site"

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following:
     ```
     PARSE_APPLICATION_ID=your_application_id
     PARSE_JAVASCRIPT_KEY=your_javascript_key
     PARSE_MASTER_KEY=your_master_key
     PARSE_SERVER_URL=https://parseapi.back4app.com
     JWT_SECRET=your_jwt_secret
     ```

5. **Redeploy**
   - Netlify will automatically redeploy with new environment variables
   - Or click "Trigger deploy" → "Deploy site"

#### Option 2: Netlify CLI Deployment

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Verify Deployment

1. **Check Live Site**
   - Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Test registration, login, and todo operations

2. **Check Function Logs**
   - Go to Netlify dashboard → Functions
   - View function logs for errors

3. **Monitor Back4App**
   - Check Back4App dashboard for data
   - Verify users and todos are being created

### Custom Domain (Optional)

1. In Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Update DNS records with your domain provider

## Troubleshooting

### Common Issues and Solutions

#### "Module not found" Errors

**Problem**: `Error: Module not found: Can't resolve 'parse'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### "Invalid token" Error

**Problem**: API calls return "Invalid token"

**Solutions**:
1. Check JWT_SECRET is consistent between `.env` and Netlify environment variables
2. Ensure token is being sent in Authorization header: `Bearer <token>`
3. Check token expiration (default 7 days)

#### Back4App Connection Errors

**Problem**: "Connection refused" or "Invalid credentials"

**Solutions**:
1. Verify Back4App credentials in `.env`
2. Check Back4App app is active (not suspended)
3. Ensure PARSE_SERVER_URL is correct: `https://parseapi.back4app.com`
4. Check your Back4App plan limits (free tier has limits)

#### Netlify Functions Not Working Locally

**Problem**: Functions return 404 or 500 errors

**Solutions**:
1. Ensure root dependencies are installed: `npm install`
2. Check Netlify CLI is installed: `npm install -g netlify-cli`
3. Try running functions directly: `netlify dev`
4. Check function logs: `netlify functions:logs`

#### CORS Errors

**Problem**: Browser console shows CORS errors

**Solutions**:
1. Check that CORS headers are set in `netlify/functions/utils.js`
2. Ensure API calls use correct base URL: `/.netlify/functions`
3. Check that requests include proper headers

#### Build Failures

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Loading

**Problem**: `process.env` values are undefined

**Solutions**:
1. Ensure `.env` file exists in project root
2. Restart development server after changing `.env`
3. For frontend, use `VITE_` prefix for variables
4. For Netlify functions, set variables in Netlify dashboard

#### Hot Module Replacement Not Working

**Problem**: Changes don't appear without refresh

**Solutions**:
1. Restart dev server
2. Check Vite configuration
3. Clear browser cache

### Getting Help

If issues persist:

1. **Check Documentation**:
   - [Back4App Docs](https://docs.back4app.com)
   - [Netlify Docs](https://docs.netlify.com)
   - [React Docs](https://react.dev)

2. **Check Logs**:
   - Browser console
   - Netlify function logs
   - Back4App dashboard logs

3. **Community Resources**:
   - Stack Overflow
   - GitHub Issues
   - Netlify Community Forum

4. **Verify Setup**:
   - Run through setup steps again
   - Check all environment variables
   - Verify Back4App configuration

## Additional Resources

### Development Tools

- **VS Code**: Recommended IDE with React extensions
- **React DevTools**: Browser extension for debugging
- **Postman**: For testing API endpoints

### Learning Resources

- [React Tutorial](https://react.dev/learn)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Back4App Quick Start](https://www.back4app.com/docs/get-started)

### Performance Optimization

- Enable caching in Netlify
- Optimize images
- Use lazy loading for components
- Minimize bundle size

## Next Steps

After successful deployment:

1. **Add Features**:
   - Todo categories/tags
   - Due dates
   - Priority levels
   - Search/filter functionality

2. **Improve UI**:
   - Add animations
   - Better responsive design
   - Dark mode
   - Custom themes

3. **Enhance Security**:
   - Rate limiting
   - Input validation
   - CSRF protection
   - Email verification

4. **Add Testing**:
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

5. **Monitoring**:
   - Error tracking (Sentry)
   - Analytics (Google Analytics)
   - Performance monitoring

---

**Last Updated**: 2026-09-26
**Version**: 1.0.0
