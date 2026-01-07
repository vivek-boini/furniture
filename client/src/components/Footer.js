import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Footer = () => {
    const [contactInfo, setContactInfo] = useState({
        phone: "+91-9999999999",
        email: "contact@furnidecor.com"
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Assuming the backend is on the same host or proxied, otherwise use full URL 
                const res = await axios.get('https://furniture-server-04rv.onrender.com/api/settings')
                if (res.data) {
                    setContactInfo({
                        phone: res.data.callNumber || "+91-9999999999",
                        email: res.data.email || "contact@furnidecor.com"
                    })
                }
            } catch (err) {
                console.error("Failed to fetch footer settings", err)
            }
        }
        fetchSettings()
    }, [])

    return (
        <footer className="site-footer" style={{ backgroundColor: '#262626', color: '#e5e5e5', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '2rem'
                }}>

                    {/* Brand Column */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <h2 style={{ color: 'var(--primary-color)', fontWeight: 800, marginBottom: '1rem' }}>FurniDecor.</h2>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#a3a3a3', maxWidth: '350px' }}>
                            Transform your living space with our premium furniture collection.
                            Crafted for comfort, designed for style, and built to last.
                            Experience the art of living with FurniDecor.
                        </p>

                    </div>

                    {/* Company Column */}
                    <div style={{ flex: '0 0 150px' }}>
                        <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>COMPANY</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="/" style={{ color: '#a3a3a3', textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>
                            <Link to="/about" style={{ color: '#a3a3a3', textDecoration: 'none', fontSize: '0.95rem' }}>About us</Link>
                        </div>
                    </div>

                    {/* Get In Touch Column */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>GET IN TOUCH</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#a3a3a3', fontSize: '0.95rem' }}>
                            <p style={{ margin: 0 }}>{contactInfo.phone}</p>
                            <p style={{ margin: 0 }}>{contactInfo.email}</p>
                        </div>
                    </div>
                </div>

                <hr style={{ margin: '3rem 0 1.5rem 0', borderColor: '#404040', opacity: 0.5 }} />

                <div style={{ textAlign: 'center', color: '#a3a3a3', fontSize: '0.85rem' }}>
                    Copyright 2026 © FurniDecor.com - All Right Reserved.
                </div>
            </div>

            {/* In-component common styles for simplicity if not in CSS */}
            <style>{`
                .social-icon {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #525252;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .social-icon:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
            `}</style>
        </footer>
    )
}

export default Footer
