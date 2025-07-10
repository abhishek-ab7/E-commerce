import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
} from '../productSlice';
import { useParams } from 'react-router-dom';
import { addToCartAsync, selectItems } from '../../cart/cartSlice';
import { selectLoggedInUser } from '../../auth/authSlice';
import { useAlert } from 'react-alert';
import { Grid } from 'react-loader-spinner';
import Modal from '../../common/Modal';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [previewImg, setPreviewImg] = useState(null);
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
      dispatch(addToCartAsync({item:newItem, alert}));
    } else {
      alert.error('Item Already added');
    }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  return (
    <div className="bg-background min-h-screen animate-fadeIn">
      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn"
          onClick={() => setPreviewImg(null)}
          tabIndex={-1}
          onKeyDown={e => { if (e.key === 'Escape') setPreviewImg(null); }}
        >
          <img
            src={previewImg}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-elevated border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      {status === 'loading' ? (
        <Grid
          height="80"
          width="80"
          color="rgb(99,102,241)"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : null}
      {product && (
        <div className=" -mt-4 max-w-7xl mx-auto px-4 animate-slideUp">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-muted">
              {product.breadcrumbs && product.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id} className="flex items-center">
                  <a href={breadcrumb.href} className="text-muted hover:text-primary font-medium">{breadcrumb.name}</a>
                  <svg width={16} height={20} viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" className="h-5 w-4 text-gray-300 mx-2"><path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" /></svg>
                </li>
              ))}
              <li className="font-semibold text-primary">{product.title}</li>
            </ol>
          </nav>

          {/* Main Card */}
          <div className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="w-full aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-muted shadow-lg">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                  onClick={() => setPreviewImg(product.images[0])}
                />
              </div>
              <div className="flex gap-4">
                {product.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-muted shadow aspect-square w-32 h-32 flex items-center justify-center">
                    <img
                      src={img}
                      alt={product.title}
                      className="w-full h-full object-cover object-center cursor-zoom-in"
                      onClick={() => setPreviewImg(img)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info & Actions */}
            <div className="flex flex-col justify-between animate-slideUp">
              <div>
                <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">{product.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <StarIcon className="w-6 h-6 text-accent" />
                  <span className="text-lg font-medium text-gray-700">{product.rating} / 5</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
  <span className="text-2xl font-bold text-primary">
    ${product.discountPrice !== undefined ? product.discountPrice : Math.round(product.price * (1 - product.discountPercentage / 100))}
  </span>
  <span className="text-lg line-through text-gray-400">${product.price}</span>
</div>

                <p className="text-base text-gray-700 mb-6">{product.description}</p>
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Color</h3>
                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex gap-3">
                      <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                      {product.colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              color.selectedClass,
                              active && checked ? 'ring ring-offset-1' : '',
                              !active && checked ? 'ring-2' : '',
                              'relative flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none border-2 border-muted'
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">{color.name}</RadioGroup.Label>
                          <span aria-hidden="true" className={classNames(color.class, 'h-8 w-8 rounded-full border border-black border-opacity-10')} />
                        </RadioGroup.Option>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Size</h3>
                    <RadioGroup value={selectedSize} onChange={setSelectedSize} className="grid grid-cols-4 gap-2">
                      <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                      {product.sizes.map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={({ active }) =>
                            classNames(
                              size.inStock ? 'cursor-pointer bg-surface text-gray-900 shadow-sm' : 'cursor-not-allowed bg-muted text-gray-200',
                              active ? 'ring-2 ring-primary' : '',
                              'group relative flex items-center justify-center rounded-lg border py-3 px-4 text-sm font-medium uppercase hover:bg-muted focus:outline-none sm:flex-1 sm:py-4 transition-all duration-200'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                              {size.inStock ? (
                                <span className={classNames(active ? 'border' : 'border-2', checked ? 'border-primary' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-lg')} aria-hidden="true" />
                              ) : (
                                <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-lg border-2 border-gray-200">
                                  <svg className="absolute inset-0 h-full w-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor"><line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" /></svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                <button
                  onClick={handleCart}
                  type="submit"
                  className="mt-8 w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-elevated hover:bg-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 animate-bounceIn"
                >
                  Add to Cart
                </button>
              </div>
              {/* Highlights & Details */}
              <div className="mt-10">
                {product.highlights && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Highlights</h3>
                    <ul className="list-disc space-y-2 pl-4 text-sm text-gray-600">
                      {product.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Details</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
