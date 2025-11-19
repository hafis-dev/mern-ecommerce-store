import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import axios from 'axios'
import {toast} from 'react-toastify'
import { Link, Navigate } from 'react-router-dom'
function SignupPage() {
    const { user, login } = useContext(AuthContext)
  

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''

    })
    // 🚀 If already logged in → redirect
    if (user) return <Navigate to="/" replace />;
    async function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            })
            login(res.data);
            toast.success("Account created successfully!");
            window.location.replace("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />

            <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            <button>Create Account</button>
            
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>


        </form>
    )
}

export default SignupPage