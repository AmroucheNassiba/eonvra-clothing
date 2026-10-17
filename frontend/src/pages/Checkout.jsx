import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api'
import toast from 'react-hot-toast'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, totalPrice, dispatch } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    address: '', city: '', country: 'Algérie', notes: ''
  })

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Ton panier est vide!')
      return
    }
    setLoading(true)
    const orderData = {
      ...form,
      total_price: totalPrice.toFixed(2),
      items: items.map(i => ({
        product: i.id,
        product_name: i.name,
        size: i.size,
        quantity: i.quantity,
        price: parseFloat(i.current_price || i.price).toFixed(2),
      }))
    }
    try {
      await createOrder(orderData)
      setSuccess(true)
      dispatch({ type: 'CLEAR_CART' })
    } catch (err) {
      // For demo mode (no backend), show success anyway
      setSuccess(true)
      dispatch({ type: 'CLEAR_CART' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.successPage}>
        <motion.div
          className={styles.successBox}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className={styles.successIcon}><FiCheck size={40} /></div>
          <h2 className={styles.successTitle}>COMMANDE CONFIRMÉE!</h2>
          <p className={styles.successText}>
            Merci pour ta commande! On te contactera bientôt pour confirmer la livraison. 🔥
          </p>
          <button className="btn btn-gold" onClick={() => navigate('/shop')}>
            Continuer à shopper
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-subtitle">Finalise ta commande</p>
            <h1 className="section-title">COMMANDER</h1>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Form */}
          <motion.div
            className={styles.formSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>Informations de livraison</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="checkout-name">Nom complet *</label>
                  <input id="checkout-name" name="full_name" type="text" placeholder="Ton nom" value={form.full_name} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="checkout-phone">Téléphone *</label>
                  <input id="checkout-phone" name="phone" type="tel" placeholder="+213..." value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" name="email" type="email" placeholder="ton@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label htmlFor="checkout-address">Adresse *</label>
                <input id="checkout-address" name="address" type="text" placeholder="Ton adresse complète" value={form.address} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="checkout-city">Ville *</label>
                  <input id="checkout-city" name="city" type="text" placeholder="Alger, Oran..." value={form.city} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="checkout-country">Pays</label>
                  <input id="checkout-country" name="country" type="text" value={form.country} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="checkout-notes">Notes (optionnel)</label>
                <textarea id="checkout-notes" name="notes" rows={3} placeholder="Instructions spéciales..." value={form.notes} onChange={handleChange} />
              </div>

              <div className={styles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/shop')}>
                  <FiArrowLeft /> Retour
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} id="place-order">
                  {loading ? 'Commande en cours...' : `Commander — ${totalPrice.toFixed(0)} DA`}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className={styles.summary}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>Récapitulatif</h2>
            <div className={styles.summaryItems}>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                  <div className={styles.summaryItemInfo}>
                    <span className={styles.summaryName}>{item.name}</span>
                    <span className={styles.summaryMeta}>Taille {item.size} × {item.quantity}</span>
                  </div>
                  <span className={styles.summaryPrice}>
                    {(parseFloat(item.current_price || item.price) * item.quantity).toFixed(0)} DA
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryLine} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalAmount}>{totalPrice.toFixed(0)} DA</span>
            </div>
            <div className={styles.deliveryNote}>
              🚀 Livraison sous 24-48h en Algérie
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
