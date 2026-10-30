import { useEffect, useState } from 'react'

const STORAGE_KEY = 'todo-demo-items'

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []

    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const handleAddTodo = (event) => {
    event.preventDefault()

    const value = input.trim()
    if (!value) return

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        text: value,
        completed: false,
      },
    ])
    setInput('')
  }

  const handleToggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const handleDeleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <header className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">待办清单</h1>
          </header>

          <form onSubmit={handleAddTodo} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="添加一个待办事项"
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
              aria-label="待办事项输入框"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              添加
            </button>
          </form>

          <ul className="mt-6 space-y-3">
            {todos.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                还没有待办事项
              </li>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="h-4 w-4 rounded border-slate-300 accent-red-500"
                    style={{ accentColor: '#ef4444' }}
                    aria-label={`标记 ${todo.text} 完成状态`}
                  />

                  <span
                    className={`flex-1 text-base break-words ${
                      todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 transition hover:border-red-200 hover:text-red-600"
                    aria-label={`删除 ${todo.text}`}
                  >
                    删除
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
