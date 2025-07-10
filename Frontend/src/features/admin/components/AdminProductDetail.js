import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
} from '../../product/productSlice';
import { useParams } from 'react-router-dom';
import { addToCartAsync, selectItems } from '../../cart/cartSlice';
import { selectLoggedInUser } from '../../auth/authSlice';
import { useAlert } from 'react-alert';
import { Grid } from 'react-loader-spinner';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


export default function AdminProductDetail() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const status = useSelector(selectProductListStatus);

  const handleCart = (e) => {
    e.preventDefault();
    if (items.findIndex((item) => item.product.id === product.id) < 0) {
      console.log({ items, product });
      const newItem = {
        product: product.id,
        quantity: 1,
      };
      if (selectedColor) {
        newItem.color = selectedColor;
      }
      if (selectedSize) {
        newItem.size = selectedSize;
      }
      dispatch(addToCartAsync(newItem));
      alert.success('Item added to Cart');
    } else {
      alert.error('Item Already added');
    }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  return (
    <div className="bg-background min-h-screen animate-fadeIn">
      {status === 'loading' ? (
        <Grid height="80" width="80" color="rgb(99,102,241)" ariaLabel="grid-loading" radius="12.5" wrapperStyle={{}} wrapperClass="" visible={true} />
      ) : null}
      {product && (
        <div className="pt-10 max-w-7xl mx-auto animate-slideUp">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2">
              {product.breadcrumbs && product.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id} className="flex items-center">
                  <a href={breadcrumb.href} className="text-sm font-medium text-primary hover:underline">{breadcrumb.name}</a>
                  <svg width={16} height={20} viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" className="h-5 w-4 text-gray-300 mx-2"><path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" /></svg>
                </li>
              ))}
              <li className="text-sm font-medium text-gray-500">{product.title}</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-2xl shadow-lg bg-glass/80 animate-fadeIn">
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover object-center" />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <h1 className="text-4xl font-extrabold text-primary mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-primary">${product.discountPrice}</span>
                <span className="text-lg line-through text-gray-400">${product.price}</span>
                <span className="ml-4 px-3 py-1 rounded-full font-semibold bg-accent text-white text-xs">{product.brand}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon key={rating} className={classNames(product.rating > rating ? 'text-primary' : 'text-gray-200', 'h-5 w-5')} aria-hidden="true" />
                ))}
                <span className="text-sm text-gray-500 ml-2">{product.rating} / 5</span>
              </div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {product.colors && product.colors.map((color) => (
                  <span key={color.id} className={classNames('inline-block w-6 h-6 rounded-full border-2', color.class)}></span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {product.sizes && product.sizes.map((size) => (
                  <span key={size.id} className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs mr-2 mb-2">{size.name}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={handleCart} className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-elevated hover:bg-accent transition-colors duration-200 animate-bounceIn">Add to Cart</button>
                <a href={`/admin/product-form/edit/${product.id}`} className="px-6 py-3 bg-white/80 text-primary border border-primary rounded-xl font-bold shadow-soft hover:bg-primary hover:text-white transition-colors duration-200">Edit Product</a>
              </div>
              {product.deleted && <span className="text-xs text-red-500 font-bold mt-2">Deleted</span>}
            </div>
          </div>
          <div className="bg-glass/60 rounded-2xl shadow-inner p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-primary mb-4">Highlights</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {product.highlights && product.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
