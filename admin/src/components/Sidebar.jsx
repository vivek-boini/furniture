import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Sidebar = ({ isOpen, close }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/login')
    }

    const navLinkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        color: isActive ? 'white' : '#94a3b8',
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontWeight: 500
    })

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>FurniDecor Admin</h3>
                    <button
                        className="mobile-close-btn"
                        onClick={close}
                        style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavLink to="/overview" style={navLinkStyle} onClick={close}>
                        Overview
                    </NavLink>
                    <NavLink to="/products" style={navLinkStyle} onClick={close}>
                        Products
                    </NavLink>
                    <NavLink to="/orders" style={navLinkStyle} onClick={close}>
                        Orders
                    </NavLink>
                    <NavLink to="/requests" style={navLinkStyle} onClick={close}>
                        Requests
                    </NavLink>
                    <NavLink to="/settings" style={navLinkStyle} onClick={close}>
                        Settings
                    </NavLink>
                    <NavLink to="/profile" style={navLinkStyle} onClick={close}>
                        Profile
                    </NavLink>
                    {localStorage.getItem('adminRole') === 'superadmin' && (
                        <NavLink to="/admins" style={navLinkStyle} onClick={close}>
                            Manage Admins
                        </NavLink>
                    )}
                </nav>
            </div>

            <div style={{ paddingBottom: '1rem' }}>
                <button onClick={handleLogout} className="btn btn-outline-danger w-100">
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
