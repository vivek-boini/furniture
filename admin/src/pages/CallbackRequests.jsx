import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CallbackRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const res = await axios.get('https://furniture-server-04rv.onrender.com/api/settings/callback', config)
            setRequests(res.data)
        } catch (err) {
            console.error("Failed to fetch requests", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.patch(`https://furniture-server-04rv.onrender.com/api/settings/callback/${id}`, { status }, config)
            fetchRequests() // Refresh list
        } catch (err) {
            console.error("Update failed", err)
            alert("Failed to update status")
        }
    }

    if (loading) return <div className="p-4">Loading requests...</div>

    return (
        <div className="section">
            <div className="container">
                <h2 className="mb-4">Callback Requests</h2>

                {requests.length === 0 ? (
                    <div className="card p-4 text-center text-muted">No callback requests yet.</div>
                ) : (
                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {requests.map(req => (
                            <div key={req._id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${req.status === 'pending' ? '#ef4444' : req.status === 'contacted' ? '#f59e0b' : '#22c55e'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h5 style={{ fontWeight: 'bold', margin: 0 }}>{req.name}</h5>
                                    <span className={`badge ${req.status === 'pending' ? 'bg-danger' : 'bg-success'}`}
                                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white', backgroundColor: req.status === 'pending' ? '#ef4444' : req.status === 'contacted' ? '#f59e0b' : '#22c55e' }}>
                                        {req.status}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '0.5rem' }}><strong>📞 Phone:</strong> {req.phone}</div>
                                {req.email && <div style={{ marginBottom: '0.5rem' }}><strong>✉️ Email:</strong> {req.email}</div>}
                                {req.message && <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#64748b' }}>"{req.message}"</div>}

                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                    Requested: {new Date(req.createdAt).toLocaleString()}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {req.status !== 'contacted' && req.status !== 'resolved' && (
                                        <button onClick={() => updateStatus(req._id, 'contacted')} className="btn btn-sm btn-outline-warning"
                                            style={{ padding: '0.25rem 0.75rem', border: '1px solid #f59e0b', color: '#f59e0b', background: 'white', borderRadius: '4px' }}>
                                            Mark Contacted
                                        </button>
                                    )}
                                    {req.status !== 'resolved' && (
                                        <button onClick={() => updateStatus(req._id, 'resolved')} className="btn btn-sm btn-outline-success"
                                            style={{ padding: '0.25rem 0.75rem', border: '1px solid #22c55e', color: '#22c55e', background: 'white', borderRadius: '4px' }}>
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CallbackRequests
