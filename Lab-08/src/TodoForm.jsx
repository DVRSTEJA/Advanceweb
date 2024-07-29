import { useState } from "react"
import './TodoForm.css'
function TodoForm({onSubmit}){
    const [newItem, setNewItem] = useState("")
    function handleSubmit(e){
        e.preventDefault()
        if (newItem === ""){
            return
        } 
        onSubmit(newItem)
        setNewItem("")
      }
    return (
        <>
            <form onSubmit={handleSubmit} className="new-item-form">
                    <div className="form-row">
                        <input placeholder="Add Task" type="text" id="item" value={newItem} onChange={e => setNewItem(e.target.value)}  />
                    </div>
                    <button>Add Item</button>
            </form>
        </>
    )
}

export default TodoForm