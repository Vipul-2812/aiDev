import React, { useState ,useContext } from "react";
import axios from 'axios';
import { Link,useNavigate } from "react-router-dom";

import { UserContext } from "../../context/user.context";

const Login = () => {
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
        await axios.post('http://localhost:5000/user/login', {
            email,
            password
        }).then((res)=>{
          localStorage.setItem('token', res.data.token)
          setUser(res.data.user)
          // console.log(res.data)
          // console.log(res.data.user)
          navigate('/');
        }).catch((err)=>{
          console.log(`error while login ${err.response.data}`)
        })
   
    
};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account? <Link to="/register" className="text-blue-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;