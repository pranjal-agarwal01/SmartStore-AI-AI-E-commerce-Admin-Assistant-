import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiShoppingCart } from 'react-icons/fi';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, dashRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/sales/dashboard'),
      ]);
      setProducts(productsRes.data);
      setRecentSales(dashRes.data.recentSales || []);
    } catch (error) {
      console.error('Failed to load data');
    }
  };

  const handleRecordSale = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/sales', { productId: selectedProduct, quantity: Number(quantity) });
      toast.success('Sale recorded!');
      setSelectedProduct('');
      setQuantity(1);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record sale');
    } finally {
      setLoading(false);
    }
  };

  const selectedProductData = products.find(p => p._id === selectedProduct);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Record New Sale</h3>
          <form onSubmit={handleRecordSale} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} - ${p.price} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            {selectedProductData && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p><span className="font-medium">Price:</span> ${selectedProductData.price}</p>
                <p><span className="font-medium">Available Stock:</span> {selectedProductData.stock}</p>
                <p className="font-medium text-indigo-600 mt-1">
                  Total: ${(selectedProductData.price * quantity).toFixed(2)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max={selectedProductData?.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiShoppingCart />
              {loading ? 'Recording...' : 'Record Sale'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
          {recentSales.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No sales recorded yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentSales.map((sale) => (
                <div key={sale._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">{sale.product?.name || 'Deleted Product'}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {sale.quantity} &middot; {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-bold text-green-600">${sale.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
