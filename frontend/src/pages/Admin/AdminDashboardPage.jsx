import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const { data } = await API.get('/api/admin/sellers');
      setSellers(data);
    } catch (error) {
      toast.error('Could not fetch sellers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (sellerId) => {
    try {
      await API.put(`/api/admin/sellers/${sellerId}/approve`);
      toast.success('Seller approved!');
      fetchSellers();
    } catch (error) {
      toast.error('Failed to approve seller.');
    }
  };

  const handleToggleBlock = async (sellerId) => {
    try {
      const { data } = await API.put(`/api/admin/users/${sellerId}/toggle-block`);
      toast.success(`User ${data.user.isBlocked ? 'blocked' : 'unblocked'}.`);
      fetchSellers();
    } catch (error) {
      toast.error('Action failed.');
    }
  };

  if (loading) return <div className="text-center py-16 text-brand-text-secondary">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-brand-text-primary">Admin Dashboard</h1>

      <div className="bg-brand-secondary rounded-2xl p-6 overflow-x-auto shadow-md border border-brand-border">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-brand-border bg-brand-primary/50">
              <th className="p-4 text-brand-text-primary">Business Name</th>
              <th className="p-4 text-brand-text-primary">Email</th>
              <th className="p-4 text-brand-text-primary">Status</th>
              <th className="p-4 text-right text-brand-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr
                key={seller._id}
                className="border-b border-brand-border last:border-none hover:bg-brand-primary/10 transition-colors duration-200"
              >
                <td className="p-4 text-brand-text-primary">{seller.businessName}</td>
                <td className="p-4 text-brand-text-secondary">{seller.email}</td>
                <td className="p-4">
                  {seller.isBlocked ? (
                    <span className="px-2 py-1 text-xs font-semibold text-red-100 bg-red-600 rounded-full">Blocked</span>
                  ) : seller.isApproved ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-100 bg-green-600 rounded-full">Approved</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-yellow-100 bg-yellow-600 rounded-full">Pending</span>
                  )}
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {!seller.isApproved && !seller.isBlocked && (
                    <button
                      onClick={() => handleApprove(seller._id)}
                      className="bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleBlock(seller._id)}
                    className={`text-white cursor-pointer text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ${
                      seller.isBlocked
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {seller.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
