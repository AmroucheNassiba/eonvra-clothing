import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, isOpen, dispatch, totalPrice, totalItems } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />

          {/* Panel */}
          <motion.div
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>Panier</h2>
                <span className={styles.count}>{totalItems} article{totalItems > 1 ? 's' : ''}</span>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                id="close-cart"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Items */}
            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <FiShoppingBag size={48} className={styles.emptyIcon} />
                  <p>Votre panier est vide</p>
                  <Link
                    to="/shop"
                    className="btn btn-gold"
                    onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  >
                    Voir le Shop
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      className={styles.item}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                    >
                      <div className={styles.itemImg}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className={styles.imgPlaceholder}>
                            <FiShoppingBag size={24} />
                          </div>
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <span className={styles.itemSize}>Taille: {item.size}</span>
                        <div className={styles.itemBottom}>
                          <div className={styles.qty}>
                            <button
                              onClick={() => dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { id: item.id, size: item.size, quantity: item.quantity - 1 }
                              })}
                            >
                              <FiMinus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { id: item.id, size: item.size, quantity: item.quantity + 1 }
                              })}
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <span className={styles.itemPrice}>
                            {(parseFloat(item.current_price || item.price) * item.quantity).toFixed(2)} DA
                          </span>
                        </div>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => dispatch({
                          type: 'REMOVE_ITEM',
                          payload: { id: item.id, size: item.size }
                        })}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.total}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>{totalPrice.toFixed(2)} DA</span>
                </div>
                <Link
                  to="/checkout"
                  className={`btn btn-primary ${styles.checkoutBtn}`}
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  id="go-to-checkout"
                >
                  Commander
                </Link>
                <button
                  className={styles.clearBtn}
                  onClick={() => dispatch({ type: 'CLEAR_CART' })}
                >
                  Vider le panier
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
