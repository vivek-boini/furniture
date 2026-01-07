import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductForm from '../components/ProductForm'

const Products = () => {
    const [products, setProducts] = useState([])
    const [editingProduct, setEditingProduct] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const [filter, setFilter] = useState('all') // 'all', 'offer'

    const fetchProducts = async () => {
        try {
            const res = await axios.get('https://furniture-server-04rv.onrender.com/api/products')
            setProducts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const filteredProducts = products.filter(p => {
        if (filter === 'offer') return p.isOffer || p.discountPrice
        return true
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return
        const token = localStorage.getItem('adminToken')
        try {
            await axios.delete(`https://furniture-server-04rv.onrender.com/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchProducts()
        } catch (err) {
            alert("Failed to delete")
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Products</h2>
                    <p>Manage your product inventory</p>
                </div>
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add New Product</button>
                )}
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    All Products
                </button>
                <button
                    className={`btn ${filter === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('offer')}
                >
                    Offer Products
                </button>
            </div>

            {showForm ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh'
                }}>
                    <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '700px' }}>
                        <h4 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                        <ProductForm
                            product={editingProduct}
                            onSuccess={() => { setShowForm(false); setEditingProduct(null); fetchProducts() }}
                            onCancel={() => { setShowForm(false); setEditingProduct(null) }}
                        />
                    </div>
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                                    <td><span style={{
                                        padding: '0.25rem 0.5rem',
                                        background: '#f1f5f9',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        color: '#475569'
                                    }}>{p.category}</span></td>
                                    <td style={{ fontWeight: 600 }}>
                                        {p.discountPrice ? (
                                            <div>
                                                <span style={{ color: '#dc2626' }}>₹{p.discountPrice.toLocaleString()}</span>
                                                <br />
                                                <small style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{p.price.toLocaleString()}</small>
                                            </div>
                                        ) : (
                                            <>₹{p.price.toLocaleString()}</>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                onClick={() => { setEditingProduct(p); setShowForm(true) }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                onClick={() => handleDelete(p._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Products
