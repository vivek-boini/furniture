import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

function ProductDetails() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState("")

    // State for dynamic settings
    const [settings, setSettings] = useState({
        whatsappNumber: "919999999999",
        callNumber: "+91999999999"
    })

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [orderForm, setOrderForm] = useState({
        name: '',
        info: '', // mapping email/phone
        phone: '',
        address: '',
        email: '',
        notes: ''
    })
    const [orderStatus, setOrderStatus] = useState(null) // null, submitting, success, error

    useEffect(() => {
        // Fetch Settings
        axios.get('https://furniture-server-04rv.onrender.com/api/settings')
            .then(res => {
                if (res.data) setSettings(res.data)
            })
            .catch(err => console.error("Failed to fetch settings", err))

        // Fetch Product
        axios
            .get(`https://furniture-server-04rv.onrender.com/api/products/${id}`)
            .then((res) => {
                setProduct(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    const handleOrderSubmit = async (e) => {
        e.preventDefault()
        setOrderStatus('submitting')

        try {
            await axios.post('https://furniture-server-04rv.onrender.com/api/orders', {
                product: product.name,
                name: orderForm.name,
                email: orderForm.email,
                phone: orderForm.phone,
                address: orderForm.address,
                notes: orderForm.notes,
                amount: product.discountPrice || product.price,
                status: 'Pending'
            })
            setOrderStatus('success')
            setTimeout(() => {
                setIsOrderModalOpen(false)
                setOrderStatus(null)
                setOrderForm({ name: '', Phone: '', address: '', email: '', notes: '' })
            }, 3000)
        } catch (err) {
            console.error(err)
            setOrderStatus('error')
        }
    }

    if (loading) return (
        <section className="section">
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Loading...</div>
            </div>
        </section>
    )

    if (!product) return (
        <section className="section">
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <h3>Product not found</h3>
                <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
            </div>
        </section>
    )

    const handleWhatsApp = () => {
        const message = `Hi, I am interested in ${product.name}.`
        window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
    }

    return (
        <section className="section" style={{ backgroundColor: '#fff' }}>
            <div className="container">
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', gap: '0.5rem', fontWeight: 600 }}>
                    ← Back to Shop
                </Link>

                <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                    {/* Image Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', aspectRatio: '4/3' }}>
                            <img
                                src={selectedImage || product.imageUrl}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                            />
                        </div>

                        {/* Gallery Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {/* Main Image Thumbnail */}
                                <div
                                    onClick={() => setSelectedImage(product.imageUrl)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: selectedImage === product.imageUrl ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                        flexShrink: 0
                                    }}>
                                    <img src={product.imageUrl} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Additional Images */}
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: selectedImage === img ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                            flexShrink: 0
                                        }}>
                                        <img src={img} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Column */}
                    <div>
                        <div style={{ marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                            {product.category}
                        </div>
                        <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 2.5rem)', lineHeight: 1.2 }}>{product.name}</h1>

                        <div className="product-price" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                            {product.discountPrice ? (
                                <>
                                    ₹{product.discountPrice.toFixed(2)}
                                    <span className="original-price" style={{ fontSize: '1.25rem' }}>₹{product.price.toFixed(2)}</span>
                                </>
                            ) : (
                                <>₹{product.price ? product.price.toFixed(2) : 'N/A'}</>
                            )}
                        </div>

                        <div style={{ marginBottom: '2.5rem', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                            <h5 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Description</h5>
                            <p>{product.description}</p>
                        </div>

                        <div style={{
                            padding: '2rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '1rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h4 style={{ marginBottom: '1rem' }}>Interested in this product?</h4>
                            <p style={{ marginBottom: '1.5rem' }}>Order now and we will get it delivered to your doorstep.</p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsOrderModalOpen(true)}
                                    style={{ flex: 1, backgroundColor: '#d97706', border: 'none', fontSize: '1.1rem', padding: '1rem' }}
                                >
                                    Order Now
                                </button>
                                <button className="btn btn-secondary" onClick={handleWhatsApp} style={{ flex: 1, textAlign: 'center', backgroundColor: '#25D366', color: 'white', border: 'none' }}>
                                    Chat on WhatsApp
                                </button>
                            </div>
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <a href={`tel:${settings.callNumber}`} style={{ fontWeight: 600 }}>📞 Call Us: {settings.callNumber}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            {isOrderModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '1rem', padding: '2rem',
                        width: '100%', maxWidth: '500px', position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => setIsOrderModalOpen(false)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
                                fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'
                            }}
                        >
                            &times;
                        </button>

                        <h3 style={{ marginBottom: '1.5rem', color: '#1e3a8a', textAlign: 'center' }}>Place Order</h3>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem' }}>{product.name}</p>

                        {orderStatus === 'success' ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Order Placed!</h4>
                                <p>We will contact you soon for order confirmation and delivery details.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleOrderSubmit}>
                                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                                    <input
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        value={orderForm.name}
                                        onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
                                    <input
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        value={orderForm.phone}
                                        onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                                        placeholder="Mobile Number"
                                    />
                                </div>
                                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        value={orderForm.email}
                                        onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Delivery Address</label>
                                    <textarea
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        value={orderForm.address}
                                        onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                        placeholder="Full Address with Pincode"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Special Instructions</label>
                                    <textarea
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        value={orderForm.notes}
                                        onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                                        placeholder="Any specific requests?"
                                        rows="2"
                                    />
                                </div>

                                {orderStatus === 'error' && (
                                    <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        Failed to submit order. Please try again.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={orderStatus === 'submitting'}
                                    className="btn btn-primary"
                                    style={{ width: '100%', backgroundColor: '#d97706', border: 'none' }}
                                >
                                    {orderStatus === 'submitting' ? 'Processing...' : 'Confirm Order'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default ProductDetails
