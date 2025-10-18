import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import CartContext from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Please log in to add items to your cart.');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -6, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full"
    >
      <Link
        to={`/products/${product._id}`}
        className="block bg-gradient-to-b from-white to-brand-secondary/70 rounded-2xl overflow-hidden border border-brand-border shadow-md hover:shadow-lg hover:border-brand-accent/50 transition-all duration-300 group"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-2">
          <h3 className="text-lg font-semibold text-brand-text-primary group-hover:text-brand-accent transition-colors duration-300 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-brand-text-secondary">
            Sold by {product.user?.businessName || 'Seller'}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex justify-between items-center pt-3">
            <p className="text-2xl font-bold text-brand-accent tracking-tight">
              ₹{product.price.toFixed(2)}
            </p>

            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer bg-white text-brand-accent border border-brand-accent p-3 rounded-full 
                         hover:bg-brand-accent hover:scale-0.8 shadow-md 
                         hover:shadow-brand-accent/40 transition-all duration-300"
              aria-label="Add to cart"
            >
              <FiShoppingCart className="text-lg" />
              <span className="absolute inset-0 rounded-full border border-brand-highlight opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
