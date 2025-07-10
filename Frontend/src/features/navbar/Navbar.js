import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectItems } from '../cart/cartSlice';
import { selectLoggedInUser } from '../auth/authSlice';
import { selectUserInfo } from '../user/userSlice';


const navigation = [
  { name: 'Anything', link: '/', user: true },
  { name: 'Anything', link: '/admin', admin: true },
  
  { name: 'Orders', link: '/admin/orders', admin: true },
];
const userNavigation = [
  { name: 'My Profile', link: '/profile' },
  { name: 'My Orders', link: '/my-orders' },
  { name: 'Sign out', link: '/logout' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);

  return (
    <>
      {userInfo && (
        <div className="min-h-full">
          <Disclosure as="nav" className="backdrop-blur-md bg-glass/80 dark:bg-glass-dark/80 shadow-glass sticky top-0 z-50 transition-all duration-300">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Link to="/">
                          <img
                            className="h-10 w-10 drop-shadow-lg animate-fadeIn"
                            src="/logo512.png"
                            alt="Anything Logo"
                          />
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) =>
                            item[userInfo.role] ? (
                              <Link
                                key={item.name}
                                to={item.link}
                                className={classNames(
                                  'relative group transition-all duration-200',
                                  item.name === 'Anything'
                                    ? 'text-3xl font-extrabold tracking-tight px-4 py-2 text-primary'
                                    : 'rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                              >
                                <span className="inline-block">
                                  {item.name === 'Anything' ? 'Anything' : item.name}
                                </span>
                                {/* Animated underline */}
                                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                              </Link>
                            ) : null
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <Link to="/cart">
                          <button
                            type="button"
                            className="relative rounded-full bg-white/80 shadow-soft p-1 text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                          >
                            <span className="sr-only">View cart</span>
                            <ShoppingCartIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                            {items.length > 0 && (
                              <span className="absolute -top-2 -right-2 animate-bounce inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white shadow-elevated ring-2 ring-white">
                                {items.length}
                              </span>
                            )}
                          </button>
                        </Link>
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-white/80 shadow-soft text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full "
                                src="/user.png"
                                alt="User avatar"
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white/90 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      to={item.link}
                                      className={classNames(
                                        active ? 'bg-primary/10 text-primary' : '',
                                        'block px-4 py-2 text-sm text-gray-700 rounded-lg transition-colors duration-150'
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Cart icon in mobile view */}
                      <Link to="/cart">
                        <button
                          type="button"
                          className="relative rounded-full bg-white/80 shadow-soft p-2 text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors mr-2"
                        >
                          <span className="sr-only">View cart</span>
                          <ShoppingCartIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 animate-bounce inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white shadow-elevated ring-2 ring-white">
                              {items.length}
                            </span>
                          )}
                        </button>
                      </Link>
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white/80 p-2 text-gray-700 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden bg-glass/90 shadow-glass animate-slideUp">
                  <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) =>
                      item[userInfo.role] ? (
                        <Link
                          key={item.name}
                          to={item.link}
                          className={classNames(
                            'block relative group rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-primary transition-all duration-200',
                            item.name === 'Anything' ? 'text-3xl font-extrabold tracking-tight px-4 py-2' : ''
                          )}
                        >
                          <span className="inline-block">{item.name === 'Anything' ? 'Anything' : item.name}</span>
                          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                        </Link>
                      ) : null
                    )}
                  </div>
                  <div className="border-t border-gray-200 pb-3 pt-4">
                    <div className="flex flex-col items-center px-5 gap-2">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-primary shadow"
                        src={userInfo.imageUrl || "/user.png"}
                        alt="User avatar"
                      />
                      <div className="text-base font-medium leading-none text-gray-900">
                        {userInfo.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-500">
                        {userInfo.email}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <header className="bg-transparent shadow-none">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {/* Removed 'Anything' header */}
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default NavBar;
