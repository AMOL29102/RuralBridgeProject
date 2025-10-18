import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CartContext from '../../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const { cart, loading, removeFromCart } = useContext(CartContext);
  const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (loading) return <div className="text-center text-foreground mt-12">Loading Cart...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-foreground">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-xl text-[--brand-text-secondary]">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block mt-4 bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3 px-6 rounded-md shadow-md transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.product?._id}
                className="flex items-center bg-bg-muted p-4 rounded-xl shadow-medium hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  {console.log(item)}
                  <h2 className="text-lg font-semibold text-foreground">{item.product?.name}</h2>
                  <p className="text-sm text-[--brand-text-secondary]">{item.product?.description}</p>
                  <p className="text-sm text-[--brand-text-secondary]">Qty: {item.quantity}</p>
                  <p className="text-lg font-bold text-primary">₹{item.product.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product?._id)}
                  className="text-red-500 cursor-pointer hover:text-red-400 transition-colors duration-200"
                >
                  <FiTrash2 size={24} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-bg-muted p-6 rounded-xl shadow-medium h-fit">
            <h2 className="text-2xl font-bold border-b border-border pb-4 text-foreground">Order Summary</h2>
            <div className="flex justify-between mt-4 text-lg text-foreground">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <button className="mt-6 w-full cursor-pointer bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3 rounded-md shadow-md transition-all duration-300">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
