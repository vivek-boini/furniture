import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const res = await axios.get('https://furniture-server-04rv.onrender.com/api/orders', config)
            setOrders(res.data)
        } catch (err) {
            console.error("Failed to fetch orders", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const toggleStatus = async (order) => {
        try {
            const newStatus = order.status === 'Pending' ? 'Completed' : 'Pending'
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            await axios.patch(`https://furniture-server-04rv.onrender.com/api/orders/${order._id}`, { status: newStatus }, config)
            fetchOrders()
        } catch (err) {
            console.error("Update failed", err)
            alert("Failed to update status")
        }
    }

    const deleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return

        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            await axios.delete(`https://furniture-server-04rv.onrender.com/api/orders/${id}`, config)
            fetchOrders()
        } catch (err) {
            console.error("Delete failed", err)
            alert("Failed to delete order")
        }
    }

    if (loading) return <div className="p-4">Loading orders...</div>

    return (
        <div className="section">
            <div className="container">
                <h2 className="mb-4">Customer Orders</h2>

                <div className="card" style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th>Order Info</th>
                                <th>Customer Details</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-muted">No orders found</td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order._id}>
                                        <td>
                                            <div style={{ fontWeight: 'bold' }}>{order.product}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div><strong>{order.name}</strong></div>
                                            <div>📞 {order.phone}</div>
                                            <div style={{ fontSize: '0.85rem' }}>📍 {order.address}</div>
                                            {order.notes && <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Notes: {order.notes}</div>}
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>₹{order.amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}
                                                style={{
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '4px',
                                                    color: order.status === 'Completed' ? 'white' : 'black',
                                                    backgroundColor: order.status === 'Completed' ? '#22c55e' : '#facc15'
                                                }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className={`btn btn-sm ${order.status === 'Pending' ? 'btn-outline-success' : 'btn-outline-warning'}`}
                                                    onClick={() => toggleStatus(order)}
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                >
                                                    Mark {order.status === 'Pending' ? 'Done' : 'Pending'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteOrder(order._id)}
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Orders
