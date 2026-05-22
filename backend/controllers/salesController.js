const Sale = require('../models/Sale');
const Product = require('../models/Product');

const recordSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ _id: productId, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const totalAmount = product.price * quantity;

    const sale = await Sale.create({
      user: req.user._id,
      product: productId,
      quantity,
      totalAmount,
    });

    product.stock -= quantity;
    product.salesCount += quantity;
    product.revenue += totalAmount;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });

    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
    const lowStockProducts = products.filter(p => p.stock < 10);

    const topProducts = [...products]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        salesCount: p.salesCount,
        revenue: p.revenue,
      }));

    const categoryRevenue = {};
    products.forEach(p => {
      categoryRevenue[p.category] = (categoryRevenue[p.category] || 0) + p.revenue;
    });

    const recentSales = await Sale.find({ user: req.user._id })
      .populate('product', 'name price')
      .sort({ createdAt: -1 })
      .limit(10);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const daySales = await Sale.aggregate([
        {
          $match: {
            user: req.user._id,
            createdAt: { $gte: date, $lt: nextDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
            count: { $sum: '$quantity' },
          },
        },
      ]);

      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: daySales[0]?.total || 0,
        sales: daySales[0]?.count || 0,
      });
    }

    res.json({
      totalProducts,
      totalRevenue,
      totalSales,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.map(p => ({ name: p.name, stock: p.stock })),
      topProducts,
      categoryRevenue,
      recentSales,
      last7Days,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordSale, getDashboardStats };
