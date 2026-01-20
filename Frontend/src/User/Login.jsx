import { useState } from 'react'
import axios from "axios"
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/login`, formData,
        { withCredentials: true });
      console.log(res);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login
