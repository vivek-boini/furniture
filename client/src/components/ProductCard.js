import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <img src={product.imageUrl} className="product-image" alt={product.name} />
        </Link>
        {/* Helper to detect if offer/sale - simplified logic for display */}
        {(product.onSale || product.discountPrice) && (
          <div className="product-badge">Sale</div>
        )}
      </div>
      <div className="product-details">
        <h5 className="product-title">
          <Link to={`/product/${product._id}`} style={{ color: 'inherit' }}>
            {product.name}
          </Link>
        </h5>

        <div className="product-description" style={{ flex: 1, marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
            {product.category} {product.subCategory ? `> ${product.subCategory}` : ''}
          </p>
          <p style={{ fontSize: '0.9rem' }}>{product.description ? product.description.substring(0, 60) + '...' : ''}</p>
        </div>

        <div className="product-price">
          {product.discountPrice ? (
            <>
              ₹{product.discountPrice.toFixed(2)}
              <span className="original-price">₹{product.price.toFixed(2)}</span>
            </>
          ) : (
            <>₹{product.price ? product.price.toFixed(2) : 'N/A'}</>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="btn btn-primary" style={{ width: '100%' }}>
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
