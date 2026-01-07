import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const res = await axios.get('https://furniture-server-04rv.onrender.com/api/admins/profile', config)
            setFormData(prev => ({
                ...prev,
                name: res.data.name,
                email: res.data.email
            }))
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: 'Failed to fetch profile' })
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        setLoading(true)
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const updateData = {
                name: formData.name,
                email: formData.email,
            }
            if (formData.password) {
                updateData.password = formData.password
            }

            const res = await axios.put('https://furniture-server-04rv.onrender.com/api/admins/profile', updateData, config)

            // Update local storage
            localStorage.setItem('adminName', res.data.name)
            localStorage.setItem('adminEmail', res.data.email)

            setMessage({ type: 'success', text: 'Profile updated successfully' })
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid">
            <h2 className="mb-4">My Profile</h2>
            <div className="card p-4" style={{ maxWidth: '600px' }}>
                {message.text && (
                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
