import { Link } from 'react-router-dom'
import { FiInstagram, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'
import { useState } from 'react'
import { subscribeNewsletter } from '../api'
import toast from 'react-hot-toast'
import styles from './Footer.module.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await subscribeNewsletter(email)
      toast.success(res.data.message)
      setEmail('')
    } catch (err) {
      toast.error('Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className={styles.footer}>
      {/* Gold top border */}
      <div className={styles.topBorder} />

      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoText}>EONVRA</span>
              <span className={styles.logoSub}>CLOTHING</span>
            </div>
            <p className={styles.brandDesc}>
              La marque streetwear qui définit votre rue.<br />
              Des pièces uniques pour une identité unique.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com/eonvra" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FiInstagram size={18} />
              </a>
              <a href="https://tiktok.com/@eonvra" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaTiktok size={16} />
              </a>
              <a href="mailto:contact@eonvra.com" className={styles.socialLink}>
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/shop">Tous les produits</Link></li>
              <li><Link to="/shop?new_arrival=true">Nouveautés</Link></li>
              <li><Link to="/shop?featured=true">Bestsellers</Link></li>
              <li><Link to="/shop?category=hoodies">Hoodies</Link></li>
              <li><Link to="/shop?category=tshirts">T-Shirts</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Info</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/about">À Propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/lookbook">Lookbook</Link></li>
              <li><a href="#">Guide des tailles</a></li>
              <li><a href="#">Livraison & Retours</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Stay Connected</h4>
            <p className={styles.newsletterText}>
              Sois le premier à connaître les nouveaux drops et offres exclusives.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletter}>
              <input
                type="email"
                id="newsletter-email"
                placeholder="ton@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? '...' : <FiArrowRight size={18} />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>© 2026 EONVRA CLOTHING. Tous droits réservés.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGV</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
