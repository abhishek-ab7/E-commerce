const { Product } = require('../model/Product');

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {}
  if(!req.query.admin){
      condition.deleted = {$ne:true}
  }

  // If sorting by discountPrice, use aggregation
  if (req.query._sort === 'discountPrice') {
    // Build match stage for filters
    const matchStage = { $match: condition };
    // Add category filter
    if (req.query.category) {
      matchStage.$match.category = { $in: req.query.category.split(',') };
    }
    // Add brand filter
    if (req.query.brand) {
      matchStage.$match.brand = { $in: req.query.brand.split(',') };
    }
    // Add computed field for discountPrice
    const addFieldsStage = {
      $addFields: {
        discountPrice: { $round: [{ $multiply: ["$price", { $subtract: [1, { $divide: ["$discountPercentage", 100] }] }] }, 0] }
      }
    };
    // Sort stage
    const sortOrder = req.query._order === 'asc' ? 1 : -1;
    const sortStage = { $sort: { discountPrice: sortOrder } };
    // Pagination
    let skip = 0, limit = 0;
    if (req.query._page && req.query._limit) {
      limit = parseInt(req.query._limit);
      skip = limit * (parseInt(req.query._page) - 1);
    }
    const pipeline = [matchStage, addFieldsStage, sortStage];
    if (skip) pipeline.push({ $skip: skip });
    if (limit) pipeline.push({ $limit: limit });
    try {
      // Get total count for pagination
      const totalDocs = await Product.countDocuments(matchStage.$match);
      const docs = await Product.aggregate(pipeline);
      res.set('X-Total-Count', totalDocs);
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json(err);
    }
    return;
  }

  // Normal query for other sorts
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
    totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',') }});
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


