import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../api'
import ProductCard from '../components/ProductCard'
import styles from './Shop.module.css'

const DEMO_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: ['Nova Hoodie', 'Street King', 'Dark Edition', 'Gold Rush', 'Phantom', 'Urban Legend', 'Shadow Drop', 'Eclipse', 'Void Tee', 'Rebel Cut', 'Oversize Raw', 'Black Label'][i],
  slug: `product-${i + 1}`,
  category: { name: i < 7 ? 'Hoodies' : 'T-Shirts', slug: i < 7 ? 'hoodies' : 'tshirts' },
  price: [3200, 2800, 3500, 4000, 2900, 3100, 3300, 2750, 1800, 1900, 2100, 3600][i],
  current_price: [3200, 2500, 3500, 4000, 2900, 3100, 3300, 2750, 1800, 1900, 2100, 3600][i],
  sale_price: i === 1 ? 2500 : null,
  is_on_sale: i === 1,
  is_new_arrival: i < 5,
  is_bestseller: i === 1 || i === 4,
  image: `https://picsum.photos/400/500?random=${i + 20}`,
  sizes_list: ['S', 'M', 'L', 'XL'],
}))

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price_asc', label: 'Prix: Croissant' },
  { value: 'price_desc', label: 'Prix: Décroissant' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          getProducts({
            category: activeCategory !== 'all' ? activeCategory : undefined,
            search: search || undefined,
            new_arrival: searchParams.get('new_arrival') || undefined,
            featured: searchParams.get('featured') || undefined,
          }),
          getCategories(),
        ])
        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          const raw = prodRes.value.data.results || prodRes.value.data
          setProducts(Array.isArray(raw) && raw.length > 0 ? raw : DEMO_PRODUCTS)
        } else {
          setProducts(DEMO_PRODUCTS)
        }
        if (catRes.status === 'fulfilled' && catRes.value?.data) {
          const rawCats = catRes.value.data.results || catRes.value.data
          setCategories(Array.isArray(rawCats) ? rawCats : [])
        }
      } catch {
        setProducts(DEMO_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory, search])

  const safeProducts = Array.isArray(products) && products.length > 0 ? products : DEMO_PRODUCTS
  const sortedProducts = [...safeProducts].sort((a, b) => {
    if (sort === 'price_asc') return parseFloat(a.current_price) - parseFloat(b.current_price)
    if (sort === 'price_desc') return parseFloat(b.current_price) - parseFloat(a.current_price)
    return 0
  })

  const demoCategories = [
    { id: 1, name: 'Hoodies', slug: 'hoodies' },
    { id: 2, name: 'T-Shirts', slug: 'tshirts' },
    { id: 3, name: 'Accessoires', slug: 'accessories' },
  ]

  const displayCategories = Array.isArray(categories) && categories.length > 0 ? categories : demoCategories

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerBg} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-subtitle">Collection 2026</p>
            <h1 className="section-title">NOTRE <span className="text-gold">SHOP</span></h1>
          </motion.div>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        {/* Controls */}
        <div className={styles.controls}>
          {/* Search */}
          <div className={styles.searchBar}>
            <FiSearch size={18} className={styles.searchIcon} />
            <input
              id="product-search"
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} className={styles.clearSearch}>
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            id="product-sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
            className={styles.sortSelect}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <span className={styles.productCount}>
            {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Category Tabs */}
        <div className={styles.categories}>
          <button
            className={`${styles.catBtn} ${activeCategory === 'all' ? styles.catActive : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            Tout
          </button>
          {displayCategories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${activeCategory === cat.slug ? styles.catActive : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {sortedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
