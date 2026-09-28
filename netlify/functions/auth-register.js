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
    const { username, email, password } = JSON.parse(event.body);

    // Validate input
    if (!username || !email || !password) {
      return createResponse(400, { error: 'Username, email, and password are required' });
    }

    // Create user with Parse
    const user = new Parse.User();
    user.set('username', username);
    user.set('email', email);
    user.set('password', password);

    try {
      await user.signUp();
      
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
      // Handle Parse-specific errors
      if (parseError.code === Parse.Error.USERNAME_TAKEN) {
        return createResponse(400, { error: 'Username already taken' });
      }
      if (parseError.code === Parse.Error.EMAIL_TAKEN) {
        return createResponse(400, { error: 'Email already taken' });
      }
      throw parseError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return createResponse(500, { error: 'Registration failed', details: error.message });
  }
};
