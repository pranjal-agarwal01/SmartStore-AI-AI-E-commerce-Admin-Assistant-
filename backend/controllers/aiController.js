const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const askGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

const generateDescription = async (req, res) => {
  try {
    const { productName, category, price } = req.body;

    const text = await askGemini(
      `You are an e-commerce copywriter. Write a compelling product description (2-3 sentences) for: "${productName}" in category "${category}" priced at $${price}. Return ONLY the description, no extra text.`
    );

    res.json({ description: text });
  } catch (error) {
    res.json({
      description: `Introducing ${req.body.productName} - a premium ${req.body.category} product designed for quality and value. Priced at just $${req.body.price}, it offers exceptional performance and reliability. Perfect for customers who demand the best.`,
    });
  }
};

const generateSeoTags = async (req, res) => {
  try {
    const { productName, category, description } = req.body;

    const text = await askGemini(
      `You are an SEO expert. Generate 5-8 SEO tags for: "${productName}" (${category}). Description: ${description || 'N/A'}. Return ONLY a valid JSON array like ["tag1","tag2"]. No extra text.`
    );

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const tags = JSON.parse(cleaned);
    res.json({ tags });
  } catch (error) {
    const fallbackTags = [
      req.body.productName.toLowerCase(),
      req.body.category.toLowerCase(),
      'best price',
      'top quality',
      'buy online',
      'free shipping',
    ];
    res.json({ tags: fallbackTags });
  }
};

const generateCaption = async (req, res) => {
  try {
    const { productName, category, price } = req.body;

    const text = await askGemini(
      `You are a social media marketing expert. Write a catchy marketing caption (1-2 lines, with emojis) for: "${productName}" in "${category}" at $${price}. Return ONLY the caption.`
    );

    res.json({ caption: text });
  } catch (error) {
    res.json({
      caption: `🔥 Check out ${req.body.productName}! Premium quality at just $${req.body.price}. Shop now! 🛒✨`,
    });
  }
};

const generateSuggestions = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });

    if (products.length === 0) {
      return res.json({ suggestions: ['Add some products first to get AI-powered suggestions!'] });
    }

    const productSummary = products.map(p =>
      `${p.name} (${p.category}) - $${p.price}, Stock: ${p.stock}, Sales: ${p.salesCount}`
    ).join('\n');

    const text = await askGemini(
      `You are a business analyst. Analyze these products and give 3-5 actionable pricing/inventory/sales suggestions:\n${productSummary}\nReturn ONLY a valid JSON array of suggestion strings like ["suggestion1","suggestion2"]. No extra text.`
    );

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const suggestions = JSON.parse(cleaned);
    res.json({ suggestions });
  } catch (error) {
    const products = await Product.find({ user: req.user._id });
    const suggestions = [];

    const lowStock = products.filter(p => p.stock < 10);
    if (lowStock.length > 0) {
      suggestions.push(`⚠️ ${lowStock.length} product(s) have low stock (below 10 units). Consider restocking.`);
    }

    const zeroSales = products.filter(p => p.salesCount === 0);
    if (zeroSales.length > 0) {
      suggestions.push(`📊 ${zeroSales.length} product(s) have zero sales. Try running promotions or adjusting prices.`);
    }

    const highPrice = products.filter(p => p.price > 100);
    if (highPrice.length > 0) {
      suggestions.push(`💡 Consider offering bundle deals for premium products (${highPrice.length} items over $100).`);
    }

    suggestions.push('🚀 Add detailed descriptions and SEO tags to improve product visibility.');
    suggestions.push('📈 Track your top-selling categories to focus inventory investment.');

    res.json({ suggestions });
  }
};

module.exports = { generateDescription, generateSeoTags, generateCaption, generateSuggestions };
