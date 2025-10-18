import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinkClasses = ({ isActive }) =>
    `relative font-medium text-[var(--brand-text-primary)] after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-[var(--brand-accent)] after:scale-x-0 after:origin-left after:transition-transform ${
      isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClasses}>Home</NavLink>
      <NavLink to="/products" className={navLinkClasses}>Marketplace</NavLink>
      {user?.role === 'seller' && <NavLink to="/seller/dashboard" className={navLinkClasses}>Dashboard</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin/dashboard" className={navLinkClasses}>Admin Panel</NavLink>}
    </>
  );

  return (
    <header
      className="sticky top-0 z-50 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 80%, transparent)' }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--brand-accent)' }}>
          RuralBridge
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={logout}
              className="hidden cursor-pointer md:block font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
              style={{
                backgroundColor: 'var(--brand-highlight)',
                color: 'white',
              }}
            >
              Logout
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="font-medium transition-colors"
                style={{ color: 'var(--brand-text-primary)' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
                style={{
                  backgroundColor: 'var(--brand-accent)',
                  color: 'white',
                }}
              >
                Register
              </Link>
            </div>
          )}

          <Link
            to="/cart"
            className="relative transition-colors"
            style={{ color: 'var(--brand-text-primary)' }}
          >
            <FiShoppingCart size={24} />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: 'var(--brand-highlight)',
                  color: 'white',
                }}
              >
                {cartItemCount}
              </motion.span>
            )}
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: 'var(--brand-text-primary)' }}
              className='cursor-pointer'
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <div className="flex flex-col items-center gap-4">
              {navLinks}
              {user ? (
                <button
                  onClick={logout}
                  className="font-semibold cursor-pointer py-2 px-4 rounded-lg shadow-sm transition-all w-3/4"
                  style={{
                    backgroundColor: 'var(--brand-highlight)',
                    color: 'white',
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-medium transition-colors"
                    style={{ color: 'var(--brand-text-primary)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="font-semibold py-2 px-4 rounded-lg shadow-sm transition-all w-3/4 text-center"
                    style={{
                      backgroundColor: 'var(--brand-accent)',
                      color: 'white',
                    }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
