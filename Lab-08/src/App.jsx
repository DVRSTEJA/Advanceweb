import { useState } from "react"
import TodoForm from "./TodoForm"
import TodoList from "./TodoList"
import './App.css'
function App() {
  const [todos , setTodos] = useState([])

  function deleteItem(id){
    // delete specific todo with given id
    setTodos(current_Todos =>{
      return current_Todos.filter(todo => todo.id !== id)
    })
  }

  function toggleItem(id, completed){
    // set the current todo item to checked or not checked
    setTodos(current_Todos =>{
      return current_Todos.map(todo =>{
        if (todo.id === id){
          return {...todo, completed}
        }
        return todo
      })
    })
  }

  function editItem(id, title){
    // save the new title for todo item
    setTodos(current_Todos =>{
      return current_Todos.map(todo =>{
        if (todo.id === id){
          return {...todo, title}
        }
        return todo
      })
    })
  }

  function addItem(title){
    // add new item
      setTodos(current_Todos => {
        return [...current_Todos, {
            id: Math.random(),
            title,
            completed: false
          },
        ]
      });
  }
  return (
    <> 
      <div id='main'>
        <h1>ToDo - list</h1>
        <TodoForm onSubmit={addItem} />
        <TodoList todos={todos} toggleItem={toggleItem} deleteItem={deleteItem} editItem={editItem}/>
      </div>
    </>
  )
}

export default App
