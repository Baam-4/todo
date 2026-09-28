const { Parse, verifyToken, createResponse, handleCors } = require('./utils');

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'PUT') {
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

    const { id, ...updates } = JSON.parse(event.body);

    // Validate input
    if (!id) {
      return createResponse(400, { error: 'Todo ID is required' });
    }

    if (Object.keys(updates).length === 0) {
      return createResponse(400, { error: 'No updates provided' });
    }

    // Find the todo
    const Todo = Parse.Object.extend('Todo');
    const query = new Parse.Query(Todo);
    
    const todo = await query.get(id);
    
    // Verify the todo belongs to the current user
    if (todo.get('userId') !== decoded.userId) {
      return createResponse(403, { error: 'Not authorized to update this todo' });
    }

    // Update allowed fields
    if (updates.text !== undefined) {
      todo.set('text', updates.text.trim());
    }
    if (updates.completed !== undefined) {
      todo.set('completed', updates.completed);
    }

    const updatedTodo = await todo.save();

    return createResponse(200, {
      success: true,
      todo: {
        id: updatedTodo.id,
        text: updatedTodo.get('text'),
        completed: updatedTodo.get('completed'),
        createdAt: updatedTodo.get('createdAt'),
        updatedAt: updatedTodo.get('updatedAt')
      }
    });
  } catch (error) {
    console.error('Update todo error:', error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return createResponse(404, { error: 'Todo not found' });
    }
    return createResponse(500, { error: 'Failed to update todo', details: error.message });
  }
};
