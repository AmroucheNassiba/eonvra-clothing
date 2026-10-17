import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingBag, FiMenu, FiX, FiSearch, FiInstagram } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Collections', path: '/shop?category=collections' },
  { label: 'Lookbook', path: '/lookbook' },
  { label: 'À Propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems, dispatch } = useCart()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>EONVRA</span>
            <span className={styles.logoSub}>CLOTHING</span>
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className={styles.navActions}>
            <a
              href="https://instagram.com/eonvra"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconBtn}
              title="Instagram"
            >
              <FiInstagram size={20} />
            </a>
            <button
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              id="cart-toggle"
              aria-label="Panier"
            >
              <FiShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItems}
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              id="mobile-menu-toggle"
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <ul className={styles.mobileLinks}>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={link.path} className={styles.mobileLink}>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className={styles.mobileSocials}>
              <a href="https://instagram.com/eonvra" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={24} />
                @eonvra
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
