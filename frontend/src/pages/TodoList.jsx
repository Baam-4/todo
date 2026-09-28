import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await api.getTodos()
      if (response.todos) {
        setTodos(response.todos)
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await api.createTodo(newTodo)
      if (response.todo) {
        setTodos([...todos, response.todo])
        setNewTodo('')
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to create todo')
    }
  }

  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await api.updateTodo(id, { completed: !completed })
      if (response.todo) {
        setTodos(todos.map(todo => todo.id === id ? response.todo : todo))
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      const response = await api.deleteTodo(id)
      if (response.success) {
        setTodos(todos.filter(todo => todo.id !== id))
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    logout()
    navigate('/login')
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Todo List</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.username}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            style={{ flex: 1, padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 15px' }}>Add</button>
        </div>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.length === 0 ? (
          <li style={{ textAlign: 'center', color: '#666' }}>No todos yet. Add one above!</li>
        ) : (
          todos.map(todo => (
            <li 
              key={todo.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                backgroundColor: todo.completed ? '#f9f9f9' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id, todo.completed)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ 
                flex: 1, 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#999' : 'black'
              }}>
                {todo.text}
              </span>
              <button 
                onClick={() => handleDeleteTodo(todo.id)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#ff4444', 
                  color: 'white', 
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default TodoList
