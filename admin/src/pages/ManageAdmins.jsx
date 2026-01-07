import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const res = await axios.get('https://furniture-server-04rv.onrender.com/api/admins/list', config)
            setAdmins(res.data)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch admins')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            await axios.post('https://furniture-server-04rv.onrender.com/api/admins/create', formData, config)
            setSuccess('Admin created successfully')
            setFormData({ name: '', email: '', password: '', role: 'admin' })
            fetchAdmins()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Manage Admins</h2>

            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3 mb-4">
                        <h4>Create New Admin</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
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
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-control"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Admin'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card p-3">
                        <h4>Existing Admins</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map(admin => (
                                        <tr key={admin._id}>
                                            <td>{admin.name}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <span className={`badge ${admin.role === 'superadmin' ? 'bg-danger' : 'bg-primary'}`}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAdmins
