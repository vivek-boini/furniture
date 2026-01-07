import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('https://furniture-server-04rv.onrender.com/api/auth/admin-login', { email, password })
            localStorage.setItem('adminToken', res.data.token)
            localStorage.setItem('adminRole', res.data.role)
            localStorage.setItem('adminName', res.data.name)
            localStorage.setItem('adminEmail', res.data.email)
            navigate('/overview')
        } catch (err) {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="auth-container">
            <div className="card" style={{ width: '400px', padding: '2.5rem' }}>
                <div className="text-center mb-4">
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Portal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your store</p>
                </div>

                {error && <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
