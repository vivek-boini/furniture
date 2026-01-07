import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="admin-layout">
            {/* Mobile Header / Hamburger */}
            <div className="admin-mobile-header">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                    ☰
                </button>
                <span style={{ fontWeight: 'bold', marginLeft: '1rem', fontSize: '1.2rem' }}>FurniDecor Admin</span>
            </div>

            <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />

            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="admin-sidebar-backdrop"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
