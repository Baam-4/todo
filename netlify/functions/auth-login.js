const { Parse, generateToken, createResponse, handleCors } = require('./utils');

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // Validate input
    if (!username || !password) {
      return createResponse(400, { error: 'Username and password are required' });
    }

    try {
      // Login with Parse
      const user = await Parse.User.logIn(username, password);
      
      // Generate JWT token
      const token = generateToken(user);

      return createResponse(200, {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.get('username'),
          email: user.get('email')
        }
      });
    } catch (parseError) {
      if (parseError.code === Parse.Error.OBJECT_NOT_FOUND) {
        return createResponse(401, { error: 'Invalid username or password' });
      }
      throw parseError;
    }
  } catch (error) {
    console.error('Login error:', error);
    return createResponse(500, { error: 'Login failed', details: error.message });
  }
};
