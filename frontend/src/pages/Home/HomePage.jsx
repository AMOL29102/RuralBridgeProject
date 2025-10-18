import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../../components/shared/ProductCard';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import API from '../../services/api';
import heroBg from '../../assets/hero-bg.jpg';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/api/products');
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Could not fetch featured products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className=" px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with Background Image */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center py-40 rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Connecting Rural Artisans <br /> to the Global Market
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/80">
            Discover authentic, handcrafted products directly from local sellers and empower rural communities with every purchase.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-transparent hover:bg-primary-hover text-primary-foreground font-bold py-3 px-8 rounded-full border border-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 flex items-center gap-2 shadow-md"
            >
              Explore Marketplace <FiArrowRight />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-8">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center mt-8">
            <div className="loader"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
