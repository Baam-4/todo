const { Parse, verifyToken, createResponse, handleCors } = require('./utils');

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'DELETE') {
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

    const { id } = JSON.parse(event.body);

    // Validate input
    if (!id) {
      return createResponse(400, { error: 'Todo ID is required' });
    }

    // Find the todo
    const Todo = Parse.Object.extend('Todo');
    const query = new Parse.Query(Todo);
    
    const todo = await query.get(id);
    
    // Verify the todo belongs to the current user
    if (todo.get('userId') !== decoded.userId) {
      return createResponse(403, { error: 'Not authorized to delete this todo' });
    }

    // Delete the todo
    await todo.destroy();

    return createResponse(200, {
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return createResponse(404, { error: 'Todo not found' });
    }
    return createResponse(500, { error: 'Failed to delete todo', details: error.message });
  }
};
