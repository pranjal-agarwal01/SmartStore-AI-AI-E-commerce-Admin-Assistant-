import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCpu, FiTag, FiMessageSquare, FiSave } from 'react-icons/fi';

export default function AIGenerator() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [seoTags, setSeoTags] = useState([]);
  const [caption, setCaption] = useState('');
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products');
    }
  };

  const handleProductSelect = (e) => {
    const id = e.target.value;
    setSelectedProduct(id);
    if (id) {
      const product = products.find(p => p._id === id);
      setProductName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setDescription(product.description || '');
      setSeoTags(product.seoTags || []);
      setCaption(product.marketingCaption || '');
    } else {
      setProductName('');
      setCategory('');
      setPrice('');
      setDescription('');
      setSeoTags([]);
      setCaption('');
    }
  };

  const generateDescription = async () => {
    if (!productName || !category || !price) {
      toast.error('Please fill in product name, category, and price');
      return;
    }
    setLoadingDesc(true);
    try {
      const { data } = await axios.post('/api/ai/description', { productName, category, price });
      setDescription(data.description);
      toast.success('Description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setLoadingDesc(false);
    }
  };

  const generateTags = async () => {
    if (!productName || !category) {
      toast.error('Please fill in product name and category');
      return;
    }
    setLoadingTags(true);
    try {
      const { data } = await axios.post('/api/ai/seo-tags', { productName, category, description });
      setSeoTags(data.tags);
      toast.success('SEO tags generated!');
    } catch (error) {
      toast.error('Failed to generate tags');
    } finally {
      setLoadingTags(false);
    }
  };

  const generateCaption = async () => {
    if (!productName || !category || !price) {
      toast.error('Please fill in product name, category, and price');
      return;
    }
    setLoadingCaption(true);
    try {
      const { data } = await axios.post('/api/ai/caption', { productName, category, price });
      setCaption(data.caption);
      toast.success('Caption generated!');
    } catch (error) {
      toast.error('Failed to generate caption');
    } finally {
      setLoadingCaption(false);
    }
  };

  const saveToProduct = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product to save to');
      return;
    }
    try {
      await axios.put(`/api/products/${selectedProduct}`, {
        description,
        seoTags,
        marketingCaption: caption,
      });
      toast.success('Content saved to product!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI Content Generator</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Product (optional)</label>
            <select
              value={selectedProduct}
              onChange={handleProductSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Enter details manually --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.category})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Wireless Bluetooth Headphones"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Electronics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., 49.99"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiCpu className="text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold">Product Description</h3>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-3"
            rows={5}
            placeholder="AI-generated description will appear here..."
          />
          <button
            onClick={generateDescription}
            disabled={loadingDesc}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loadingDesc ? 'Generating...' : 'Generate Description'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiTag className="text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold">SEO Tags</h3>
          </div>
          <div className="min-h-[120px] mb-3">
            {seoTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {seoTags.map((tag, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">SEO tags will appear here...</p>
            )}
          </div>
          <button
            onClick={generateTags}
            disabled={loadingTags}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loadingTags ? 'Generating...' : 'Generate SEO Tags'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMessageSquare className="text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold">Marketing Caption</h3>
          </div>
          <div className="min-h-[120px] mb-3">
            {caption ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg text-gray-700">
                {caption}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Marketing caption will appear here...</p>
            )}
          </div>
          <button
            onClick={generateCaption}
            disabled={loadingCaption}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loadingCaption ? 'Generating...' : 'Generate Caption'}
          </button>
        </div>
      </div>

      {selectedProduct && (description || seoTags.length > 0 || caption) && (
        <div className="flex justify-center">
          <button
            onClick={saveToProduct}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <FiSave size={20} />
            Save All Content to Product
          </button>
        </div>
      )}
    </div>
  );
}
