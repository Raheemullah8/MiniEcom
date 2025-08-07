"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { getCartItems, updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/cartUtils';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      setCartItems(getCartItems());
      setLoading(false);
    };

    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(updateCartItemQuantity(id, newQuantity) || []);
  };

  const removeItem = (id: number) => {
    setCartItems(removeFromCart(id) || []);
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-6">
          <ShoppingBag className="mx-auto h-28 w-28 text-gray-300" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">0</span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-6 text-base md:text-lg">Discover amazing products and start shopping today!</p>
        <Link href="/">
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-8000 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black rounded-2xl shadow-md border border-gray-200">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-28 h-28 relative rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-50">{item.title}</h3>
                        <p className="text-xl font-bold text-gray-50">₹{item.price.toLocaleString()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-9 w-9 rounded-l-md hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-9 w-9 rounded-r-md hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={clearCart}
                className="text-red-600 border border-red-500 hover:bg-red-50"
                variant="outline"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="sticky top-24">
            <div className="bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Total: ₹{totalAmount.toLocaleString()}</h3>
              <Button className="w-full bg-gray-500 hover:bg-gray-400 text-white py-4 text-lg rounded-xl font-semibold">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}