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

    const { text } = JSON.parse(event.body);

    // Validate input
    if (!text || text.trim() === '') {
      return createResponse(400, { error: 'Text is required' });
    }

    // Create new Todo
    const Todo = Parse.Object.extend('Todo');
    const todo = new Todo();
    
    todo.set('text', text.trim());
    todo.set('completed', false);
    todo.set('userId', decoded.userId);

    const savedTodo = await todo.save();

    return createResponse(201, {
      success: true,
      todo: {
        id: savedTodo.id,
        text: savedTodo.get('text'),
        completed: savedTodo.get('completed'),
        createdAt: savedTodo.get('createdAt'),
        updatedAt: savedTodo.get('updatedAt')
      }
    });
  } catch (error) {
    console.error('Create todo error:', error);
    return createResponse(500, { error: 'Failed to create todo', details: error.message });
  }
};
