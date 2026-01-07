import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

function Shop() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showOnlyOffers, setShowOnlyOffers] = useState(false)

  // Filter States
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 })
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [sortBy, setSortBy] = useState('latest')

  // UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isMaterialOpen, setIsMaterialOpen] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()
  const backendUrl = "https://furniture-server-04rv.onrender.com"

  const materialsList = [
    "Sheesham Wood",
    "Engineered Wood",
    "Fabric",
    "Mango Wood",
    "Ash Wood",
    "Metal",
    "Leather"
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'latest', label: 'Latest' }
  ]

  const fetchProducts = async (paramsObj) => {
    setLoading(true)
    let url = backendUrl + '/api/products'

    const queryParams = new URLSearchParams()

    // Category & Search
    if (paramsObj.category && paramsObj.category !== 'All') {
      queryParams.append('category', paramsObj.category)
    }
    if (paramsObj.search) {
      queryParams.append('search', paramsObj.search)
    }

    // Add Filters
    queryParams.append('minPrice', priceRange.min)
    queryParams.append('maxPrice', priceRange.max)

    if (selectedMaterials.length > 0) {
      queryParams.append('material', selectedMaterials.join(','))
    }

    if (sortBy && sortBy !== 'recommended') {
      queryParams.append('sort', sortBy)
    }

    try {
      const res = await axios.get(url + '?' + queryParams.toString())
      let data = res.data || []

      // If caller requested offers-only, filter on client-side for offer flags
      if ((paramsObj && paramsObj.offers) || showOnlyOffers) {
        const isOffer = (p) => {
          if (!p) return false
          return Boolean(p.onSale || p.offer || p.discountPrice || p.isOffer || (p.category && p.category.toLowerCase() === 'sale'))
        }
        data = data.filter(isOffer)
      }

      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Effect: URL Change (Category/Search)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category')
    const search = params.get('search')
    const offers = params.get('offers')

    const paramsObj = {}
    if (cat) {
      setActiveCategory(decodeURIComponent(cat))
      paramsObj.category = decodeURIComponent(cat)
    } else {
      setActiveCategory('All')
    }
    if (offers) {
      setShowOnlyOffers(true)
      setActiveCategory('Offers')
      paramsObj.offers = true
    } else {
      setShowOnlyOffers(false)
    }
    if (search) paramsObj.search = decodeURIComponent(search)

    // Reset filters on category change? Maybe keep them.
    // fetchProducts(paramsObj) will be called by the dependency on filters below? 
    // No, better to call a unified fetcher.

    // Let's rely on a single effect that watches ALL dependencies or manage it carefully.
    // To avoid infinite loops, let's trigger fetch when any dependency changes.

  fetchProducts({ ...paramsObj })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, priceRange, selectedMaterials, sortBy])


  const toggleMaterial = (mat) => {
    if (selectedMaterials.includes(mat)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== mat))
    } else {
      setSelectedMaterials([...selectedMaterials, mat])
    }
  }





  return (
    <div className="shop-page" style={{ backgroundColor: '#f9f9f9', paddingBottom: '4rem' }}>

      {/* Header / Breadcrumb placeholder */}
      <div className="shop-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="shop-title" style={{ margin: 0 }}>{activeCategory}</h1>

          <div style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '400px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '0.25rem' }}>
            <input
              type="text"
              placeholder="Search within shop..."
              style={{ border: 'none', padding: '0.5rem 1rem', width: '100%', outline: 'none', borderRadius: '30px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/shop?search=${encodeURIComponent(e.target.value)}`)
                }
              }}
            />
            <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="shop-layout">

          {/* Sidebar / Filters */}
          <aside className="filters-sidebar">
            {/* Mobile Filter Toggle */}
            <div className="filter-group mobile-only-header" style={{ display: 'none', marginBottom: '1rem', cursor: 'pointer', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <h3 className="filter-title" style={{ margin: 0 }}>Filters {showMobileFilters ? '(-)' : '(+)'}</h3>
              <span>{showMobileFilters ? 'Hide' : 'Show'}</span>
            </div>

            <div className={`filter-content ${showMobileFilters ? 'open' : ''}`} style={{ display: typeof window !== 'undefined' && window.innerWidth < 900 && !showMobileFilters ? 'none' : 'block' }}>
              <div className="filter-group">
                <h3 className="filter-title desktop-only-title">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <div className="filter-header" onClick={() => setIsPriceOpen(!isPriceOpen)} style={{ cursor: 'pointer' }}>
                  <h4>PRICE RANGE</h4>
                  <div style={{ marginLeft: 'auto', transform: isPriceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>&#8964;</div>
                </div>

                {isPriceOpen && (
                  <>
                    {/* Manual Inputs */}
                    <div className="price-inputs" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        min="0"
                        max="99999"
                        value={priceRange.min}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), priceRange.max - 1);
                          setPriceRange({ ...priceRange, min: val });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#475569',
                          background: 'white',
                          outline: 'none'
                        }}
                      />
                      <span style={{ color: '#94a3b8' }}>-</span>
                      <input
                        type="number"
                        min="0"
                        max="99999"
                        value={priceRange.max}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), priceRange.min + 1);
                          setPriceRange({ ...priceRange, max: val });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#475569',
                          background: 'white',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Dual Sliders Simulation */}
                    <div className="range-slider-container" style={{ position: 'relative', height: '2rem' }}>
                      <input
                        type="range"
                        min="0" max="99999"
                        value={priceRange.min}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), priceRange.max - 100);
                          setPriceRange({ ...priceRange, min: val });
                        }}
                        className="range-slider"
                        style={{ position: 'absolute', width: '100%', pointerEvents: 'none', zIndex: 3, opacity: 0.7 }}
                      />
                      <input
                        type="range"
                        min="0" max="99999"
                        value={priceRange.max}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), priceRange.min + 100);
                          setPriceRange({ ...priceRange, max: val });
                        }}
                        className="range-slider"
                        style={{ position: 'absolute', width: '100%', pointerEvents: 'none', zIndex: 3, opacity: 0.7 }}
                      />
                    </div>

                    {/* Fallback/Clarification Text */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      <span>Min</span>
                      <span>Max</span>
                    </div>
                  </>
                )}
              </div>

              {/* Material */}
              <div className="filter-group">
                <div className="filter-header" onClick={() => setIsMaterialOpen(!isMaterialOpen)} style={{ cursor: 'pointer' }}>
                  <h4>MATERIAL</h4>
                  <div style={{ marginLeft: 'auto', transform: isMaterialOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>&#8964;</div>
                </div>
                {isMaterialOpen && (
                  <div className="checkbox-list">
                    {materialsList.map(mat => (
                      <label key={mat} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(mat)}
                          onChange={() => toggleMaterial(mat)}
                        />
                        <span className="checkbox-label">{mat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <main className="product-grid-area">

            {/* Sort Header */}
            <div className="sort-header">
              <div className="sort-label">Sort By :</div>
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="grid-products three-col">
                {products.length > 0 ? (
                  products.map((p, idx) => (
                    <ProductCard product={p} key={p._id || idx} />
                  ))
                ) : (
                  <div className="no-results">
                    <p>No products found matching your selection.</p>
                    <button className="btn btn-secondary" onClick={() => {
                      setActiveCategory('All');
                      setPriceRange({ min: 0, max: 99999 });
                      setSelectedMaterials([]);
                      navigate('/shop');
                    }}>
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}

export default Shop
