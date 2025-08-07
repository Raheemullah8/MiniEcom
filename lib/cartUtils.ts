export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
  if (typeof window === 'undefined') return;

  const savedCart = localStorage.getItem('cart');
  let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({ ...product, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  return cartItems;
};

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const getCartItemCount = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const removeFromCart = (productId: number) => {
  if (typeof window === 'undefined') return;
  const savedCart = localStorage.getItem('cart');
  let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
  cartItems = cartItems.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  return cartItems;
};

export const updateCartItemQuantity = (productId: number, quantity: number) => {
  if (typeof window === 'undefined') return;
  if (quantity <= 0) return removeFromCart(productId);

  const savedCart = localStorage.getItem('cart');
  let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
  const itemIndex = cartItems.findIndex(item => item.id === productId);
  
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
  
  return cartItems;
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart');
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

export const getCartTotal = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};