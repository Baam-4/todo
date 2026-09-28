const { Parse, verifyToken, createResponse, handleCors } = require('./utils');

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createResponse(401, { error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return createResponse(401, { error: 'Invalid token' });
    }

    // Logout with Parse
    await Parse.User.logOut();

    return createResponse(200, {
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return createResponse(500, { error: 'Logout failed', details: error.message });
  }
};
