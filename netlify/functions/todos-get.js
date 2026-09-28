const { Parse, verifyToken, createResponse, handleCors } = require('./utils');

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'GET') {
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

    // Create Todo query
    const Todo = Parse.Object.extend('Todo');
    const query = new Parse.Query(Todo);
    
    // Query todos for the current user
    query.equalTo('userId', decoded.userId);
    query.descending('createdAt');

    const todos = await query.find();

    // Format todos for response
    const formattedTodos = todos.map(todo => ({
      id: todo.id,
      text: todo.get('text'),
      completed: todo.get('completed'),
      createdAt: todo.get('createdAt'),
      updatedAt: todo.get('updatedAt')
    }));

    return createResponse(200, {
      success: true,
      todos: formattedTodos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    return createResponse(500, { error: 'Failed to fetch todos', details: error.message });
  }
};
