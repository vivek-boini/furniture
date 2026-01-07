import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Home() {
  const [products, setProducts] = useState([])
  const [settings, setSettings] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Callback Form State
  const [callbackName, setCallbackName] = useState('')
  const [callbackPhone, setCallbackPhone] = useState('')
  const [callbackEmail, setCallbackEmail] = useState('')
  const [callbackMessage, setCallbackMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState(null) // null, 'submitting', 'success', 'error'

  const backendUrl = "https://furniture-server-04rv.onrender.com"

  const categories = [
    { name: "Living Room", image: "/living_room.jpg" },
    { name: "Bedroom", image: "/bedroom.jpg" },
    { name: "Dining Room", image: "/dining.jpg" },
    { name: "Office", image: "/office.jpg" },
    { name: "Outdoor", image: "/outdoor.jpg" },
    { name: "Storage", image: "/storage.jpg" },
    { name: "Home Decor", image: "/Home_decor.jpg" },
  ]

  // Fetch products and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(backendUrl + "/api/products")
        setProducts(prodRes.data || [])

        const settingsRes = await axios.get(backendUrl + "/api/settings")
        setSettings(settingsRes.data || {})
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }
    fetchData()
  }, [])

  const [heroSearch, setHeroSearch] = useState('')
  const navigate = useNavigate()

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(heroSearch)}`)
    }
  }

  // Helper to detect offer products
  const isOffer = (p) => {
    if (!p) return false
    return Boolean(p.onSale || p.offer || p.discountPrice || p.isOffer || (p.category && p.category.toLowerCase() === 'sale'))
  }

  const handleCallbackSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('submitting')
    try {
      await axios.post(backendUrl + "/api/settings/callback", {
        name: callbackName,
        phone: callbackPhone,
        email: callbackEmail,
        message: callbackMessage
      })
      setSubmitStatus('success')
      // Clear form after delay or immediately?
      setTimeout(() => {
        setIsModalOpen(false)
        setSubmitStatus(null)
        setCallbackName('')
        setCallbackPhone('')
        setCallbackEmail('')
        setCallbackMessage('')
      }, 2000)
    } catch (err) {
      console.error("Callback failed:", err)
      setSubmitStatus('error')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        id="home"
        className="hero-section"
        style={{
          backgroundImage: "url(/Home_bg1.jpg)"
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title animate-in">
            Premium Furniture for Modern Homes
          </h1>

          {/* Hero Search Bar */}
          <div className="animate-in" style={{ animationDelay: '0.2s', maxWidth: '500px', margin: '0 auto 2rem', display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '50px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <input
              type="text"
              placeholder="Search for furniture..."
              style={{ flex: 1, border: 'none', padding: '0.5rem 1rem', outline: 'none', fontSize: '1rem' }}
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
            />
            <button
              onClick={handleHeroSearch}
              style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontWeight: 600 }}
            >
              Search
            </button>
          </div>

          <Link to="/shop" className="btn btn-primary btn-lg animate-in" style={{ animationDelay: '0.3s' }}>
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="section" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2>Shop by Category</h2>
            <p>Browse our wide selection of premium furniture</p>
          </div>

          <div className="category-scroller">
            {categories.map((cat) => (
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="category-item">
                <div className="category-circle">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <span className="category-label">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Offers Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2>Today's Offers</h2>
            <p>Grab limited-time deals on selected items</p>
          </div>

          <div className="grid-products">
            {products.length > 0 ? (
              (() => {
                const offers = products.filter(isOffer)
                const list = offers.length ? offers.slice(0, 4) : products.slice(0, 4) // fallback
                return list.map((p, idx) => (
                  <div key={p._id || idx} className="product-card">
                    <div className="product-image-wrapper">
                      <img src={p.imageUrl} className="product-image" alt={p.name} />
                      <div className="product-badge">Offer</div>
                    </div>
                    <div className="product-details">
                      <h5 className="product-title">{p.name}</h5>
                      <div className="product-price">
                        {p.discountPrice ? (
                          <>
                            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>₹{p.discountPrice.toFixed(2)}</span>
                            <span className="original-price" style={{ marginLeft: '0.5rem' }}>₹{p.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <>₹{p.price ? p.price.toFixed(2) : 'N/A'}</>
                        )}
                      </div>
                      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{p.description}</p>
                      <Link to={`/product/${p._id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
                    </div>
                  </div>
                ))
              })()
            ) : (
              <p className="text-center text-muted w-100">No offers available right now.</p>
            )}
          </div>

          <div className="flex-center" style={{ marginTop: "3rem" }}>
            <Link to="/shop?offers=true" className="btn btn-secondary">See all offers</Link>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="help-section" style={{ backgroundImage: "url(/living_room.jpg)" }}>
        <div className="container help-container">
          <div className="help-content">
            <h2 className="help-title">Need Help Finding the<br /> <span style={{ color: '#d97706' }}>Perfect Piece?</span></h2>
            <p className="help-subtitle">
              Our furniture experts are here to guide you.
            </p>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
              Talk To Our Furniture Expert Now
            </p>
            <div className="help-buttons">
              <a href={`tel:${settings.callNumber || '+919314444747'}`} className="btn btn-white-outline">
                📞 {settings.callNumber || '+91-9314444747'}
              </a>
              <button className="btn btn-orange" onClick={() => setIsModalOpen(true)}>
                Request A Call Back
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call Back Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '1rem', padding: '2rem',
            width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
                fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'
              }}
            >
              &times;
            </button>

            <h3 style={{ marginBottom: '1.5rem', color: '#1e3a8a' }}>Request a Call Back</h3>

            {submitStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ color: '#166534' }}>Request Sent!</h4>
                <p>We will call you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit}>
                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                  <input
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                    value={callbackName}
                    onChange={e => setCallbackName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
                  <input
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                    value={callbackPhone}
                    onChange={e => setCallbackPhone(e.target.value)}
                    placeholder="Your Phone Number"
                  />
                </div>
                <div className="mb-3" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email (Optional)</label>
                  <input
                    type="email"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                    value={callbackEmail}
                    onChange={e => setCallbackEmail(e.target.value)}
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message (Optional)</label>
                  <textarea
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                    value={callbackMessage}
                    onChange={e => setCallbackMessage(e.target.value)}
                    placeholder="Tell us what you're looking for..."
                    rows="3"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Failed to submit. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="btn btn-orange"
                  style={{ width: '100%' }}
                >
                  {submitStatus === 'submitting' ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
