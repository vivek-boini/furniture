import React from 'react'

import axios from 'axios'

const Overview = () => {
    const [stats, setStats] = React.useState({
        totalSales: 0,
        totalOrders: 0,
        productCount: 0,
        pendingOrders: 0,
        callbackRequestsCount: 0,
        recentOrders: []
    })

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken')
                const config = { headers: { Authorization: `Bearer ${token}` } }
                const res = await axios.get('https://furniture-server-04rv.onrender.com/api/orders/stats', config)
                setStats(res.data)
            } catch (err) {
                console.error("Failed to fetch stats")
            }
        }
        fetchStats()
    }, [])

    return (
        <div>
            <h2>Overview</h2>
            <div className="grid-row" style={{ marginBottom: '2rem' }}>
                <div className="card p-4 stat-card">
                    <h5 className="text-muted">Total Sales</h5>
                    <h3>₹{stats.totalSales.toLocaleString('en-IN')}</h3>
                </div>

                <div className="card p-4 stat-card">
                    <h5 className="text-muted">Total Orders</h5>
                    <h3>{stats.totalOrders}</h3>
                </div>

                <div className="card p-4 stat-card">
                    <h5 className="text-muted">Active Products</h5>
                    <h3>{stats.productCount}</h3>
                </div>

                <div className="card p-4 stat-card">
                    <h5 className="text-muted">Pending Orders</h5>
                    <h3>{stats.pendingOrders}</h3>
                </div>
            </div>

            <div className="card p-4">
                <h4 style={{ marginBottom: '1rem' }}>Recent Orders</h4>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id.substring(0, 8)}...</td>
                                        <td>{order.name}</td>
                                        <td>₹{order.amount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                backgroundColor: order.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                                                color: order.status === 'Completed' ? '#166534' : '#854d0e'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted">No recent orders found.</p>
                )}
            </div>
        </div>
    )
}

export default Overview
