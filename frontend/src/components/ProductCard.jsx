import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const { dispatch } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!selectedSize) {
      toast.error('Sélectionne une taille')
      return
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        current_price: product.current_price,
        sale_price: product.sale_price,
        image: product.image,
        size: selectedSize,
        slug: product.slug,
      }
    })
    toast.success(`${product.name} ajouté au panier! 🔥`)
    dispatch({ type: 'OPEN_CART' })
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className={styles.imgWrapper}>
        <img
          src={hovered && product.image_hover ? product.image_hover : (product.image || `https://picsum.photos/400/500?random=${product.id}`)}
          alt={product.name}
          className={styles.img}
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.is_new_arrival && <span className="badge badge-new">Nouveau</span>}
          {product.is_on_sale && <span className="badge badge-red">PROMO</span>}
          {product.is_bestseller && <span className="badge badge-gold">Best</span>}
        </div>

        {/* Overlay Actions */}
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link to={`/product/${product.slug}`} className={styles.overlayBtn} title="Voir">
            <FiEye size={18} />
          </Link>
          <button className={styles.overlayBtn} title="Favoris">
            <FiHeart size={18} />
          </button>
        </motion.div>
      </Link>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.infoTop}>
          <span className={styles.category}>{product.category?.name}</span>
          <Link to={`/product/${product.slug}`} className={styles.name}>{product.name}</Link>
        </div>

        {/* Sizes */}
        {product.sizes_list && (
          <div className={styles.sizes}>
            {product.sizes_list.map(size => (
              <button
                key={size}
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add */}
        <div className={styles.bottom}>
          <div className={styles.prices}>
            <span className={styles.price}>
              {parseFloat(product.current_price).toFixed(0)} DA
            </span>
            {product.is_on_sale && (
              <span className={styles.oldPrice}>
                {parseFloat(product.price).toFixed(0)} DA
              </span>
            )}
          </div>
          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
            title="Ajouter au panier"
          >
            <FiShoppingBag size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
