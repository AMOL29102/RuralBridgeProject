import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CartContext from '../../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Could not fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Please log in to add items to your cart.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;
  if (!product) return <div className="text-center text-2xl py-20">Product Not Found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <motion.div
          layoutId={`product-img-${id}`}
          className="rounded-2xl overflow-hidden shadow-md border border-gray-300 bg-white"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Product Details */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-300">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-2">Sold by {product.user.businessName}</p>
          <p className="text-4xl font-bold text-green-600 my-6">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="mt-8 w-full cursor-pointer flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 shadow-md cursor-pointer"
          >
            <FiShoppingCart size={22} /> Add to Cart
          </button>

          {/* Seller Info */}
          <div className="mt-8 p-6 border border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Seller Information</h3>
            {product.user.email && (
              <p className="text-gray-700 mt-2"><strong>Email:</strong> {product.user.email}</p>
            )}
            {product.user.phoneNumber && (
              <p className="text-gray-700 mt-1"><strong>Phone:</strong> {product.user.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
