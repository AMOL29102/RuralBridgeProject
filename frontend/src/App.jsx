import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductDetailPage from './pages/Products/ProductDetailPage'; // Import detail page
import ProtectedRoute from './components/auth/ProtectedRoute';
import SellerDashboardPage from './pages/Seller/SellerDashboardPage'; // Import dashboard
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import CartPage from './pages/Cart/CartPage';  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} /> {/* Add route for single product */}
        <Route path="cart" element={<CartPage />} /> 
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          {/* <Route path="admin/dashboard" element={<AdminDashboard />} /> */}
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route path="seller/dashboard" element={<SellerDashboardPage />} /> {/* Add route for seller dashboard */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;