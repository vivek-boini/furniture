import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import CallbackRequests from './pages/CallbackRequests'

import Profile from './pages/Profile'
import ManageAdmins from './pages/ManageAdmins'

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return <Navigate to="/login" replace />
    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/requests" element={<CallbackRequests />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admins" element={<ManageAdmins />} />
                    <Route path="/" element={<Navigate to="/overview" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
