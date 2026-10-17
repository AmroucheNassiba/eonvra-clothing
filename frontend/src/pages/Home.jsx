import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiInstagram } from 'react-icons/fi'
import { getProducts, getInstagramFeed } from '../api'
import ProductCard from '../components/ProductCard'
import styles from './Home.module.css'

// Mock products for when API is not running
const DEMO_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: ['Nova Hoodie', 'Street King', 'Dark Edition', 'Gold Rush', 'Phantom', 'Urban Legend', 'Shadow Drop', 'Eclipse'][i],
  slug: `product-${i + 1}`,
  category: { name: 'Hoodies' },
  price: [3200, 2800, 3500, 4000, 2900, 3100, 3300, 2750][i],
  current_price: [3200, 2800, 3500, 4000, 2900, 3100, 3300, 2750][i],
  is_on_sale: i % 3 === 0,
  is_new_arrival: i < 4,
  is_bestseller: i === 1 || i === 4,
  image: `https://picsum.photos/400/500?random=${i + 10}`,
  sizes_list: ['S', 'M', 'L', 'XL'],
}))

export default function Home() {
  const [products, setProducts] = useState([])
  const [instaPosts, setInstaPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, instaRes] = await Promise.allSettled([
          getProducts({ new_arrival: true }),
          getInstagramFeed(9),
        ])
        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          const raw = prodRes.value.data.results || prodRes.value.data
          setProducts(Array.isArray(raw) && raw.length > 0 ? raw : DEMO_PRODUCTS)
        } else {
          setProducts(DEMO_PRODUCTS)
        }
        if (instaRes.status === 'fulfilled' && Array.isArray(instaRes.value?.data?.posts)) {
          setInstaPosts(instaRes.value.data.posts)
        } else {
          setInstaPosts([])
        }
      } catch {
        setProducts(DEMO_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const displayProducts = Array.isArray(products) && products.length > 0 ? products : DEMO_PRODUCTS

  return (
    <main className={styles.main}>
      {/* ===== HERO ===== */}
      <section className={styles.hero} ref={heroRef}>
        <motion.div className={styles.heroBg} style={{ y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1920&q=80"
            alt="EONVRA Hero"
            className={styles.heroImg}
          />
          <div className={styles.heroGradient} />
        </motion.div>

        <motion.div
          className={styles.heroContent}
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <p className={styles.heroEyebrow}>New Collection 2026</p>
            <h1 className={styles.heroTitle}>
              DEFINE<br />
              <span className={styles.heroTitleGold}>YOUR</span><br />
              STREET
            </h1>
            <p className={styles.heroSub}>
              Des pièces uniques pour une identité unique.<br />
              Streetwear premium — fait pour ceux qui osent.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/shop" className="btn btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/lookbook" className="btn btn-outline">
                Lookbook
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className={styles.scrollIndicator}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <div className={styles.scrollLine} />
            <span>Scroll</span>
          </motion.div>
        </motion.div>

        {/* Gold bottom line */}
        <div className={styles.heroBottomLine} />
      </section>

      {/* ===== MARQUEE ===== */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee}>
          {[...Array(4)].map((_, i) => (
            <span key={i} className={styles.marqueeText}>
              EONVRA CLOTHING &nbsp;✦&nbsp; DEFINE YOUR STREET &nbsp;✦&nbsp; STREETWEAR PREMIUM &nbsp;✦&nbsp; NEW DROP 2026 &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {[
              { icon: '🔥', title: 'Drops Exclusifs', desc: 'Des collections en édition limitée, disponibles pour un temps limité.' },
              { icon: '💎', title: 'Qualité Premium', desc: 'Tissus haut de gamme, coutures renforcées. Built to last.' },
              { icon: '🚀', title: 'Livraison Rapide', desc: 'Expédition sous 24h. Livraison partout en Algérie.' },
              { icon: '♻️', title: 'Éco-Responsable', desc: 'Produits fabriqués de manière éthique et durable.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className={styles.products}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">Collection 2026</p>
            <h2 className="section-title">NOUVEAUX <span className="text-gold">DROPS</span></h2>
            <div className="gold-line" />
          </motion.div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {displayProducts.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className={styles.viewAll}>
            <Link to="/shop" className="btn btn-gold">
              Voir Toute la Collection <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BANNER ===== */}
      <section className={styles.banner}>
        <div className={styles.bannerBg}>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80"
            alt="EONVRA Banner"
          />
          <div className={styles.bannerOverlay} />
        </div>
        <div className={`container ${styles.bannerContent}`}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">Édition Limitée</p>
            <h2 className={styles.bannerTitle}>LA COLLECTION<br /><span>GOLD SERIES</span></h2>
            <p className={styles.bannerSub}>
              20 pièces. Une seule chance. Ne rate pas le drop.
            </p>
            <Link to="/shop?category=gold-series" className="btn btn-gold">
              Découvrir <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== INSTAGRAM FEED ===== */}
      <section className={styles.instagram}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">Rejoins la communauté</p>
            <h2 className="section-title">
              <FiInstagram className="text-gold" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              @EONVRA
            </h2>
            <div className="gold-line" />
          </motion.div>

          <div className={styles.instaGrid}>
            {(Array.isArray(instaPosts) && instaPosts.length > 0 ? instaPosts : DEMO_PRODUCTS.slice(0, 8)).map((post, i) => (
              <motion.a
                key={post.id || i}
                href={post.permalink || 'https://instagram.com/eonvra'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instaItem}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <img
                  src={post.image_url || post.image || `https://picsum.photos/400/400?random=${i + 50}`}
                  alt={post.caption || 'EONVRA Instagram'}
                />
                <div className={styles.instaOverlay}>
                  <FiInstagram size={24} />
                </div>
              </motion.a>
            ))}
          </div>

          <div className={styles.viewAll}>
            <a
              href="https://instagram.com/eonvra"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <FiInstagram /> Suivre @eonvra
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
