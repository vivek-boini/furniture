import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Categories logic (Duplicated here or shared via a constant file - kept here for simplicity as requested)
const categoryGroups = {
    "Living Room": ["Sofas", "Coffee Tables", "TV Stands", "Chairs", "Recliners", "Side Tables"],
    "Bedroom": ["Beds", "Wardrobes", "Nightstands", "Dressers", "Mattresses"],
    "Dining Room": ["Dining Set", "Dining Table", "Dining Chairs", "Sideboards"],
    "Office": ["Office Chairs", "Desks", "Bookshelves", "Filing Cabinets"],
    "Outdoor": ["Outdoor Chairs", "Outdoor Tables", "Patio Sets", "Garden Decor"],
    "Storage": ["Shelves", "Cabinets", "Wardrobes"],
    "Home Decor": ["Lamps", "Rugs", "Wall Art", "Mirrors"]
}

const ProductForm = ({ product, onSuccess, onCancel }) => {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('Living Room') // Main Category
    const [subCategory, setSubCategory] = useState('')      // Sub Category
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [material, setMaterial] = useState('')
    const [image, setImage] = useState(null)
    const [additionalImages, setAdditionalImages] = useState([])
    const [isOffer, setIsOffer] = useState(false)
    const [discountPrice, setDiscountPrice] = useState('')
    const [loading, setLoading] = useState(false)

    // Update subcategories when main category changes
    useEffect(() => {
        // If changing category manually, reset subcat unless it matches (logic for fresh validation)
        const subs = categoryGroups[category] || []
        if (subs.length > 0 && !subs.includes(subCategory)) {
            setSubCategory(subs[0])
        }
    }, [category])

    useEffect(() => {
        if (product) {
            setName(product.name)
            setCategory(product.category)
            setSubCategory(product.subCategory || '') // Load existing or default
            setPrice(product.price)
            setDescription(product.description)
            setIsOffer(product.isOffer || false)
            setDiscountPrice(product.discountPrice || '')
            setMaterial(product.material || '')
        }
    }, [product])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('category', category)
        formData.append('subCategory', subCategory)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('material', material)
        formData.append('isOffer', isOffer)
        if (discountPrice) formData.append('discountPrice', discountPrice)
        if (image) formData.append('image', image)

        // Append all additional images
        if (additionalImages && additionalImages.length > 0) {
            Array.from(additionalImages).forEach(file => {
                formData.append('additionalImages', file)
            })
        }

        const token = localStorage.getItem('adminToken')
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            if (product) {
                await axios.put(`https://furniture-server-04rv.onrender.com/api/products/${product._id}`, formData, config)
            } else {
                await axios.post('https://furniture-server-04rv.onrender.com/api/products', formData, config)
            }
            onSuccess()
        } catch (err) {
            console.error(err)
            alert("Error saving product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Product Name</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Category (Main)</label>
                    <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                        {Object.keys(categoryGroups).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Sub Category</label>
                    <select className="form-control" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                        {(categoryGroups[category] || []).map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Price (₹)</label>
                <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>

            <div className="mb-3">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Material</label>
                <input
                    type="text"
                    className="form-control"
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    placeholder="e.g. Sheesham Wood, Teak, Fabric"
                />
            </div>

            <div className="mb-3 p-3 bg-light rounded border">
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isOfferCheck"
                        checked={isOffer}
                        onChange={e => setIsOffer(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="isOfferCheck">Set as Today's Offer</label>
                </div>
                {isOffer && (
                    <div>
                        <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Discounted Price (₹)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discountPrice}
                            onChange={e => setDiscountPrice(e.target.value)}
                            required={isOffer}
                            placeholder="Enter the lower offer price"
                        />
                        <small className="text-muted">This price will be shown as the deal price.</small>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Description</label>
                <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="mb-4">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Product Image</label>
                <input type="file" className="form-control" onChange={e => setImage(e.target.files[0])} />
                <small className="text-muted">Leave empty to keep existing image when editing</small>
            </div>

            <div className="mb-4">
                <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Additional Images (Gallery)</label>
                <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={e => setAdditionalImages(e.target.files)}
                />
                <small className="text-muted">Select multiple files to create a gallery. Be careful, this replaces the previous gallery.</small>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default ProductForm
