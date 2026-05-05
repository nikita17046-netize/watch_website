const productModel = require("../models/product.model");

// create product
module.exports.createProduct = async ({
  name,
  description,
  stock,
  price,
  discount,
  isNewProduct,
  sku,
  images,
  brand,
  category,
}) => {
  if (
    !name ||
    !description ||
    sku === undefined ||
    price === undefined ||
    stock === undefined ||
    !images ||
    !brand ||
    !category
  ) {
    throw new Error("All Fields Are Required !!");
  }

  let product = await productModel.create({
    name,
    description,
    stock,
    price,
    discount,
    isNewProduct,
    sku,
    images,
    brand,
    category,
  });

  return product;
};

// get single product
module.exports.singleProduct = async (id) => {
  const product = await productModel.findOne({ _id: id });

  return product;
};

// all product
module.exports.AllProduct = async (query = {}) => {
  const { category, brand, sale, isNewProduct, sort, search } = query;
  
  let filter = {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (sale === 'true') filter.discount = { $gt: 0 };
  if (isNewProduct === 'true') filter.isNewProduct = true;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  let queryBuilder = productModel.find(filter);

  // Sorting
  if (sort === 'newest') {
    queryBuilder = queryBuilder.sort({ createdAt: -1 });
  } else if (sort === 'price-low') {
    queryBuilder = queryBuilder.sort({ price: 1 });
  } else if (sort === 'price-high') {
    queryBuilder = queryBuilder.sort({ price: -1 });
  } else {
    queryBuilder = queryBuilder.sort({ createdAt: -1 }); // Default to newest
  }

  return await queryBuilder;
};

// update product
module.exports.updateProduct = async ({
  productId,
  name,
  description,
  stock,
  price,
  discount,
  isNewProduct,
  sku,
  images,
  brand,
  category,
}) => {
  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: productId },
    {
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct,
      sku,
      images,
      brand,
      category,
    },
    { new: true },
  );

  if (!updatedProduct) {
    throw new Error("Product not Found");
  }

  return updatedProduct;
};

// delete product
module.exports.deleteProduct = async (id) => {
  return await productModel.findOneAndDelete({ _id: id });
};
