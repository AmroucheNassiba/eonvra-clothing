import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#FFD700', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#CC0000', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
