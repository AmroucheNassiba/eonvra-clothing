import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'
import toast from 'react-hot-toast'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Message envoyé! On te répond bientôt 🔥')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-subtitle">On est là pour toi</p>
            <h1 className="section-title">NOUS <span className="text-gold">CONTACTER</span></h1>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Info */}
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.infoTitle}>Parle-nous</h2>
            <p className={styles.infoText}>
              Tu as une question sur une commande, une taille, ou tu veux juste chill avec l'équipe ? On est dispo.
            </p>

            <div className={styles.contacts}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><FiMail /></div>
                <div>
                  <span className={styles.contactLabel}>Email</span>
                  <a href="mailto:contact@eonvra.com">contact@eonvra.com</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><FiPhone /></div>
                <div>
                  <span className={styles.contactLabel}>WhatsApp</span>
                  <a href="https://wa.me/213XXXXXXXX">+213 XX XX XX XX</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><FiMapPin /></div>
                <div>
                  <span className={styles.contactLabel}>Localisation</span>
                  <span>Algérie</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className={styles.social}>
              <p className={styles.socialLabel}>Retrouve-nous sur</p>
              <div className={styles.socialLinks}>
                <a href="https://instagram.com/eonvra" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                  <FiInstagram size={20} />
                  Instagram
                </a>
                <a href="https://tiktok.com/@eonvra" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                  <FaTiktok size={18} />
                  TikTok
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className={styles.formWrapper}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-name">Nom</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Ton nom"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="ton@email.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contact-subject">Sujet</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Sujet de ton message"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder="Ton message..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={sending} id="contact-submit">
                {sending ? 'Envoi...' : <>Envoyer <FiSend /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
