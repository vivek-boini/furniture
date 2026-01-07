import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [expandedCategory, setExpandedCategory] = React.useState(null)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const toggleCategory = (group) => {
    if (expandedCategory === group) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(group)
    }
  }

  // ... (handleSearch removed previously) ...

  // Organized categories with emojis (Shared logic)
  const categoryGroups = {
    // "All" handled separately
    "Living Room": ["Sofas", "Coffee Tables", "TV Stands", "Chairs", "Recliners", "Side Tables"],
    "Bedroom": ["Beds", "Wardrobes", "Nightstands", "Dressers", "Mattresses"],
    "Dining Room": ["Dining Set", "Dining Table", "Dining Chairs", "Sideboards"],
    "Office": ["Office Chairs", "Desks", "Bookshelves", "Filing Cabinets"],
    "Outdoor": ["Outdoor Chairs", "Outdoor Tables", "Patio Sets", "Garden Decor"],
    "Storage": ["Shelves", "Cabinets", "Wardrobes"],
    "Home Decor": ["Lamps", "Rugs", "Wall Art", "Mirrors"]
  }

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`)
  }

  return (
    <nav className="navbar">
      <div className="container nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hamburger Button (Mobile Only) */}
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <Link to="/" className="nav-brand" style={{ marginRight: '1rem' }}>
            FurniDecor
          </Link>
        </div>

        {/* Desktop Navigation (Horizontal) */}
        <div className="shop-top-nav desktop-nav" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', margin: 0, padding: 0 }}>
          <div className="nav-category-group" onClick={() => handleCategoryClick('All')}>
            <span className="nav-category-trigger">
              All Products
            </span>
          </div>

          {Object.entries(categoryGroups).map(([group, subCats]) => {
            return (
              <div key={group} className="nav-category-group">
                <div
                  className="nav-category-trigger"
                  onClick={() => handleCategoryClick(group)}
                >
                  {group} {subCats.length > 0 && <span style={{ fontSize: '0.7em' }}>▼</span>}
                </div>
                {subCats.length > 0 && (
                  <div className="sub-navbar">
                    {subCats.map(sub => (
                      <button
                        key={sub}
                        className="sub-nav-item"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCategoryClick(sub)
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        </div>

        <div className="sidebar-links">
          <div className="sidebar-item" onClick={() => { handleCategoryClick('All'); toggleSidebar() }}>
            All Products
          </div>
          {Object.entries(categoryGroups).map(([group, subCats]) => (
            <div key={group} className="sidebar-group">
              <div
                className="sidebar-item"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => toggleCategory(group)}
              >
                {group}
                <span>{expandedCategory === group ? '−' : '+'}</span>
              </div>

              {expandedCategory === group && (
                <div style={{ backgroundColor: '#f9f9f9', paddingLeft: '1rem' }}>
                  <div
                    className="sidebar-item"
                    style={{ fontSize: '0.9rem', color: '#d97706', fontWeight: 'bold' }}
                    onClick={() => { handleCategoryClick(group); toggleSidebar() }}
                  >
                    All {group}
                  </div>
                  {subCats.map(sub => (
                    <div
                      key={sub}
                      className="sidebar-item"
                      style={{ fontSize: '0.9rem', color: '#475569' }}
                      onClick={() => { handleCategoryClick(sub); toggleSidebar() }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
    </nav>
  )
}

export default Navbar
