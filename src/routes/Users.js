import { useReducer, useEffect } from "react"
import { Link } from "react-router-dom"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_LIST":
      return action.payload.map(u => ({
        ...u,
        isEditing: false,
        edit: null,
      }))
    case "REMOVE_USER":
      return state.filter(u => u._id !== action.payload)
    case "START_EDIT_USER":
      return state.map(u => {
        if (u._id === action.payload) {
          return {
            ...u,
            isEditing: true,
            edit: {
              name: u.name,
              age: u.age,
              sex: u.sex,
            },
          }
        }
        return u
      })
    case "CANCEL_EDIT_USER":
      return state.map(u => {
        if (u._id === action.payload) {
          return {
            ...u,
            isEditing: false,
            edit: null,
          }
        }
        return u
      })
    case "UPDATE_USER":
      return state.map(u => {
        if (u._id === action.payload.id) {
          return {
            ...u,
            edit: {
              ...u.edit,
              [action.payload.field]: action.payload.value,
            }
          }
        }
        return u
      })
    case "SAVE_USER":
      return state.map(u => {
        if (u._id === action.payload) {
          return {
            _id: u._id,
            ...u.edit,
            isEditing: false,
            edit: null
          }
        }
        return u
      })
    default:
      return state
  }
}

function Users() {
  const [users, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/users`)
      .then(res => res.json())
      .then(result => {
        dispatch({
          type: "FETCH_LIST",
          payload: result.users
        })
      })
      .catch(() => alert("Something went wrong"))
  }, [])

  const handleRemove = (userID) => {
    fetch(`${process.env.REACT_APP_API_ROOT}/users/${userID}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(result => {
        dispatch({
          type: "REMOVE_USER",
          payload: userID,
        })
        alert(result.message)
      })
      .catch(err => alert(err.message))
  }

  const handleSave = (userID, userData) => {
    fetch(`${process.env.REACT_APP_API_ROOT}/users/${userID}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(result => {
        dispatch({
          type: "SAVE_USER",
          payload: userID,
        })
        alert(result.message)
      })
      .catch(err => alert(err.message))
  }

  const staticRow = (user, idx) => {
    return (
      <tr key={`User-${user._id}`}>
        <td>{idx + 1}</td>
        <td>{user.name}</td>
        <td>{user.age}</td>
        <td>{user.sex}</td>
        <td>
          <button
            onClick={() => dispatch({
              type: "START_EDIT_USER",
              payload: user._id,
            })}
          >
            Edit
          </button>
          <button onClick={() => handleRemove(user._id)}>Remove</button>
        </td>
      </tr>
    )
  }

  const updateEditUser = (id, e) => dispatch({
    type: "UPDATE_USER",
    payload: {
      id,
      field: e.target.name,
      value: e.target.value
    },
  })

  const editingRow = (user, idx) => {
    return (
      <tr key={`User-${user._id}`}>
        <td>{idx + 1}</td>
        <td>
          <input
            type="text"
            name="name"
            value={user.edit.name}
            onChange={(e) => updateEditUser(user._id, e)}
          />
        </td>
        <td>
          <input
            type="number"
            name="age"
            min={1}
            max={200}
            step={1}
            value={user.edit.age}
            onChange={(e) => updateEditUser(user._id, e)}
          />
        </td>
        <td>
          <select
            name="sex"
            value={user.edit.sex}
            onChange={(e) => updateEditUser(user._id, e)}
          >
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </td>
        <td>
          <button onClick={() => handleSave(user._id, user.edit)}>
            Save
          </button>
          <button
            onClick={() => dispatch({
              type: "CANCEL_EDIT_USER",
              payload: user._id
            })}
          >
            Cancel
          </button>
        </td>
      </tr>
    )
  }

  return (
    <div className="users-page">
      <nav>
        Go to <Link to="/">Home</Link> page and upload new csv
      </nav>

      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>No users</td>
          </tr>
        )}
        {users.length !== 0 && (
          users.map((u, idx) => u.isEditing ? editingRow(u, idx) : staticRow(u, idx))
        )}
        </tbody>
      </table>
    </div>
  )
}

export default Users