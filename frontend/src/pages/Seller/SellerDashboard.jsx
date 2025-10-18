import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch seller's products
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products/seller/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Handle form input
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Add or Edit Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    if (form.image) formData.append('image', form.image);

    try {
      if (editId) {
        await axios.put(`${API}/products/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API}/products`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      setForm({ name: '', price: '', description: '', image: null });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
    setLoading(false);
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({ name: product.name, price: product.price, description: product.description, image: null });
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-text-primary">Seller Dashboard</h2>
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-primary p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="bg-background border border-secondary rounded px-4 py-2 text-text-primary"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            min="0"
            className="bg-background border border-secondary rounded px-4 py-2 text-text-primary"
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="bg-background border border-secondary rounded px-4 py-2 text-text-primary col-span-2"
            required
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="col-span-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 cursor-pointer bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded transition"
        >
          {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => { setEditId(null); setForm({ name: '', price: '', description: '', image: null }); }}
            className="ml-4 mt-4 cursor-pointer bg-secondary text-text-primary font-bold py-2 px-6 rounded transition"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Product List */}
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Your Products</h3>
      <div className="grid gap-6">
        {products.length === 0 && <div className="text-text-secondary">No products yet.</div>}
        {products.map((product) => (
          <div key={product._id} className="flex items-center bg-background rounded-lg shadow p-4">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded mr-4" />
            <div className="flex-1">
              <div className="font-bold text-lg text-text-primary">{product.name}</div>
              <div className="text-text-secondary">{product.description}</div>
              <div className="text-accent font-semibold mt-1">₹{product.price}</div>
            </div>
            <button
              onClick={() => handleEdit(product)}
              className="bg-accent cursor-pointer text-white px-4 py-2 rounded mr-2 hover:bg-accent-hover transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;