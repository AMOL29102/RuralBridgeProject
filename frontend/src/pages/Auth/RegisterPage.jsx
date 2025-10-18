import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '', businessName: '', address: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, phoneNumber, password, businessName, address } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      // **THE FIX IS HERE**
      const response = await register({ ...formData, role });

      if (role === 'seller') {
        // For sellers, show the approval message and redirect to login page
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/login');
      } else {
        // For buyers, they are logged in automatically
        toast.success('Registration successful!');
        navigate('/'); // Redirect to homepage
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center py-12"
    >
      <div className="w-full max-w-lg p-8 space-y-8 bg-bg-muted rounded-2xl border border-border shadow-medium">
        <h2 className="text-3xl font-extrabold text-center text-foreground">Create Your Account</h2>
        
        {/* Role Toggle */}
        <div className="flex justify-center rounded-lg bg-bg-background p-1">
          <button
            onClick={() => setRole('buyer')}
            className={`w-full cursor-pointer py-2 rounded-md transition ${
              role === 'buyer' ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
          >
            Buyer
          </button>
          <button
            onClick={() => setRole('seller')}
            className={`w-full cursor-pointer py-2 rounded-md transition ${
              role === 'seller' ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
          >
            Seller
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Full Name"
            required
            className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email Address (optional if phone is provided)"
            className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
            placeholder="Phone Number (optional if email is provided)"
            className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />

          {role === 'seller' && (
            <>
              <input
                type="text"
                name="businessName"
                value={businessName}
                onChange={onChange}
                placeholder="Business Name"
                required
                className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <input
                type="text"
                name="address"
                value={address}
                onChange={onChange}
                placeholder="Business Address"
                required
                className="w-full px-3 py-3 border border-border bg-bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer py-3 cursor-pointer font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
