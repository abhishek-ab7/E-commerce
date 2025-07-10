import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
  fetchBrandsAsync,
  fetchCategoriesAsync,
} from '../../product/productSlice';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import { useAlert } from 'react-alert';

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const alert = useAlert();
  const navigate = useNavigate();

  const colors = [
    {
      name: 'White',
      class: 'bg-white',
      selectedClass: 'ring-gray-400',
      id: 'white',
    },
    {
      name: 'Gray',
      class: 'bg-gray-200',
      selectedClass: 'ring-gray-400',
      id: 'gray',
    },
    {
      name: 'Black',
      class: 'bg-gray-900',
      selectedClass: 'ring-gray-900',
      id: 'black',
    },
  ];

  const sizes = [
    { name: 'XXS', inStock: true, id: 'xxs' },
    { name: 'XS', inStock: true, id: 'xs' },
    { name: 'S', inStock: true, id: 's' },
    { name: 'M', inStock: true, id: 'm' },
    { name: 'L', inStock: true, id: 'l' },
    { name: 'XL', inStock: true, id: 'xl' },
    { name: '2XL', inStock: true, id: '2xl' },
    { name: '3XL', inStock: true, id: '3xl' },
  ];

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
    // Fetch brands and categories on mount
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('thumbnail', selectedProduct.thumbnail);
      setValue('stock', selectedProduct.stock);
      setValue('image1', selectedProduct.images[0]);
      setValue('image2', selectedProduct.images[1]);
      setValue('image3', selectedProduct.images[2]);
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
      setValue('highlight1', selectedProduct.highlights[0]);
      setValue('highlight2', selectedProduct.highlights[1]);
      setValue('highlight3', selectedProduct.highlights[2]);
      setValue('highlight4', selectedProduct.highlights[3]);
      setValue(
        'sizes',
        selectedProduct.sizes.map((size) => size.id)
      );
      setValue(
        'colors',
        selectedProduct.colors.map((color) => color.id)
      );
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = async () => {
    if (!params.id) return;
    try {
      // Use the full backend URL to ensure it works without a proxy
      const response = await fetch('http://localhost:5000/products/' + params.id, { method: 'DELETE' });
      if (!response.ok) {
        const error = await response.json();
        alert.error(error.error || 'Failed to delete product');
        return;
      }
      alert.success('Product deleted');
      setTimeout(() => {
        navigate('/admin');
      }, 800);
    } catch (err) {
      alert.error('Failed to delete product');
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center animate-fadeIn">
      <form noValidate onSubmit={handleSubmit((data) => {
          console.log(data);
          const product = { ...data };
          product.images = [
            product.image1,
            product.image2,
            product.image3,
            product.thumbnail,
          ];
          product.highlights = [
            product.highlight1,
            product.highlight2,
            product.highlight3,
            product.highlight4,
          ];
          product.rating = 0;
          if (product.colors) {
            product.colors = product.colors.map((color) =>
              colors.find((clr) => clr.id === color)
            );
          }
          if (product.sizes) {
            product.sizes = product.sizes.map((size) =>
              sizes.find((sz) => sz.id === size)
            );
          }

          delete product['image1'];
          delete product['image2'];
          delete product['image3'];
          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;
          console.log(product);
          if (params.id) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAsync(product));
            alert.success('Product Updated');

            reset();
          } else {
            dispatch(createProductAsync(product));
            alert.success('Product Created');
            reset();
          }
        })} className="w-full max-w-3xl bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-10 mt-12 animate-slideUp" disabled={selectedProduct && selectedProduct.deleted}>
        <h2 className="text-3xl font-extrabold text-primary mb-8">{params.id ? 'Edit Product' : 'Add Product'}</h2>
        <div className="space-y-8">
          {/* Product Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primary mb-1">Product Name</label>
            <input type="text" {...register('title', { required: 'name is required' })} id="title" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary mb-1">Description</label>
            <textarea {...register('description', { required: 'description is required' })} id="description" rows={3} className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
          </div>
          {/* Price & Discount */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="price" className="block text-sm font-medium text-primary mb-1">Price</label>
              <input type="number" {...register('price', { required: 'price is required' })} id="price" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
            <div className="flex-1">
              <label htmlFor="discountPercentage" className="block text-sm font-medium text-primary mb-1">Discount %</label>
              <input type="number" {...register('discountPercentage', { required: 'discount is required' })} id="discountPercentage" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
          </div>
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-primary mb-1">Stock</label>
            <input type="number" {...register('stock', { required: 'stock is required' })} id="stock" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
          </div>
          {/* Brand & Category */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="brand" className="block text-sm font-medium text-primary mb-1">Brand</label>
              <select {...register('brand', { required: 'brand is required' })} id="brand" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" style={{ direction: 'ltr' }}>
                <option value="">Select Brand</option>
                {brands && brands.length > 0 ? (
                  brands.map(brand => (
                    <option key={brand.value} value={brand.value}>{brand.label}</option>
                  ))
                ) : (
                  <option disabled>No brands found</option>
                )}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="category" className="block text-sm font-medium text-primary mb-1">Category</label>
              <select {...register('category', { required: 'category is required' })} id="category" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" style={{ direction: 'ltr' }}>
                <option value="">Select Category</option>
                {categories && categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))
                ) : (
                  <option disabled>No categories found</option>
                )}
              </select>
            </div>
          </div>
          {/* Images */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="image1" className="block text-sm font-medium text-primary mb-1">Image 1</label>
              <input type="text" {...register('image1', { required: 'image1 is required' })} id="image1" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
            <div className="flex-1">
              <label htmlFor="image2" className="block text-sm font-medium text-primary mb-1">Image 2</label>
              <input type="text" {...register('image2', { required: 'image2 is required' })} id="image2" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
            <div className="flex-1">
              <label htmlFor="image3" className="block text-sm font-medium text-primary mb-1">Image 3</label>
              <input type="text" {...register('image3', { required: 'image3 is required' })} id="image3" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
          </div>
          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-primary mb-1">Thumbnail</label>
            <input type="text" {...register('thumbnail', { required: 'thumbnail is required' })} id="thumbnail" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
          </div>
          {/* Highlights */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="highlight1" className="block text-sm font-medium text-primary mb-1">Highlight 1</label>
              <input type="text" {...register('highlight1')} id="highlight1" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
            <div className="flex-1">
              <label htmlFor="highlight2" className="block text-sm font-medium text-primary mb-1">Highlight 2</label>
              <input type="text" {...register('highlight2')} id="highlight2" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="highlight3" className="block text-sm font-medium text-primary mb-1">Highlight 3</label>
              <input type="text" {...register('highlight3')} id="highlight3" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
            <div className="flex-1">
              <label htmlFor="highlight4" className="block text-sm font-medium text-primary mb-1">Highlight 4</label>
              <input type="text" {...register('highlight4')} id="highlight4" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200" />
            </div>
          </div>
          {/* Colors & Sizes */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="colors" className="block text-sm font-medium text-primary mb-1">Colors</label>
              <select multiple {...register('colors')} id="colors" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200">
                {colors.map((color) => <option key={color.id} value={color.id}>{color.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="sizes" className="block text-sm font-medium text-primary mb-1">Sizes</label>
              <select multiple {...register('sizes')} id="sizes" className="block w-full rounded-lg border-0 bg-white/80 py-2 px-3 text-gray-900 shadow-soft focus:ring-2 focus:ring-primary focus:outline-none sm:text-base transition-all duration-200">
                {sizes.map((size) => <option key={size.id} value={size.id}>{size.name}</option>)}
              </select>
            </div>
          </div>
          {/* Submit & Delete */}
          <div className="flex gap-4 mt-8">
            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-elevated hover:bg-accent transition-colors duration-200 animate-bounceIn" disabled={selectedProduct && selectedProduct.deleted}>{params.id ? 'Update Product' : 'Add Product'}</button>
            {params.id && <button type="button" onClick={handleDelete} className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold shadow-elevated hover:bg-red-700 transition-colors duration-200" disabled={selectedProduct && selectedProduct.deleted}>Delete</button>}
          </div>
          {selectedProduct && selectedProduct.deleted && <span className="text-xs text-red-500 font-bold mt-2">This product is deleted</span>}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
