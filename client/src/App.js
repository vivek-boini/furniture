import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/shop'
import ProductDetails from './pages/ProductDetails'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AboutUs from './pages/AboutUs'

import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <main className="site-main" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  )
}

export default App
