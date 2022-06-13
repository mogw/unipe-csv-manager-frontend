import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Home from './routes/Home'
import Users from './routes/Users'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
