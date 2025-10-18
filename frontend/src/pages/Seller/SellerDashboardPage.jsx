import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiList, FiArrowLeft } from 'react-icons/fi';

const SellerDashboardPage = () => {
  const [view, setView] = useState('menu'); // 'menu', 'form', 'list'
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/api/products/seller/mine');
      setProducts(data);
    } catch (error) {
      toast.error("Could not fetch your products.");
    }
  };

  useEffect(() => {
    if (view === 'list') fetchProducts();
  }, [view]);

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', image: null });
    setEditId(null);
  };

  const handleAddClick = () => {
    resetForm();
    setView('form');
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setForm({ name: product.name, price: product.price, description: product.description, image: null });
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will also remove the product from customer carts.')) return;
    try {
      await API.delete(`/api/products/${id}`);
      toast.success("Product deleted.");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key !== 'image' || form.image) formData.append(key, form[key]);
    });

    try {
      if (editId) await API.put(`/api/products/${editId}`, formData);
      else await API.post('/api/products', formData);
      toast.success('Product saved!');
      setView('list');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div whileHover={{ scale: 1.05 }} onClick={handleAddClick} className="bg-white p-8 rounded-2xl text-center cursor-pointer shadow-md border border-gray-300 transition-transform duration-300">
        <FiPlus className="mx-auto text-5xl text-green-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Add New Product</h2>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} onClick={() => setView('list')} className="bg-white p-8 rounded-2xl text-center cursor-pointer shadow-md border border-gray-300 transition-transform duration-300">
        <FiList className="mx-auto text-5xl text-green-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">View & Manage Products</h2>
      </motion.div>
    </div>
  );

  const renderForm = () => (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-gray-300 shadow-md">
      <button onClick={() => setView(editId ? 'list' : 'menu')} className="flex cursor-pointer items-center gap-2 mb-6 text-green-600 font-semibold cursor-pointer"><FiArrowLeft /> Back</button>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{editId ? 'Edit Product' : 'Add a New Product'}</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Product Description"
          required
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price (₹)"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900"
        />
        <input
          type="file"
          name="image"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-green-600 hover:file:bg-gray-200 cursor-pointer"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 cursor-pointer font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 transition-all duration-300 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );

  const renderList = () => (
    <div>
      <button onClick={() => setView('menu')} className="flex cursor-pointer items-center gap-2 mb-6 text-green-600 font-semibold cursor-pointer"><FiArrowLeft /> Back to Dashboard</button>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product._id} className="flex items-center bg-white p-4 rounded-2xl shadow-md border border-gray-300">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-green-600 font-semibold">₹{product.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(product)} className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Seller Dashboard</h1>
      {view === 'menu' && renderMenu()}
      {view === 'form' && renderForm()}
      {view === 'list' && renderList()}
    </motion.div>
  );
};

export default SellerDashboardPage;
