// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Add this import
import { getProducts } from "@/service/productService";
import Loading from './(admin)/dashboard/loading';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearch } from './layout'; // Import the search context
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { addToCart } from '@/lib/cartUtils';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isSignedIn } = useAuth();
  
  // Use search context from layout
  const { searchQuery, setSearchQuery } = useSearch();
  const searchParams = useSearchParams();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl
    });
    // You can add a toast notification here
    console.log(`Added ${product.title} to cart`);
  };

  // Carousel images
  const carouselImages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop",
      title: "Premium Collection",
      subtitle: "Exclusive products for our valued customers",
      buttonText: "Explore Now"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop",
      title: "New Arrivals",
      subtitle: "Discover our latest additions",
      buttonText: "Shop Now"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop",
      title: "Limited Edition",
      subtitle: "Special items available for a short time",
      buttonText: "View Collection"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Check for search parameter in URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, setSearchQuery]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Black Theme Carousel */}
      <div className="relative h-96 overflow-hidden bg-black">
        {carouselImages.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-6">{slide.subtitle}</p>
                  <button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors border border-white">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all border border-white"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all border border-white"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Our Products</h2>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} results for "{searchQuery}"
              </p>
            )}
          </div>
          
          {loading ? (
            <Loading />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group h-full flex flex-col border border-gray-200">
                  <div className="relative h-48">
                    <Image
                      width={300}
                      height={300}
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
                      }}
                    />
                    <button className="absolute top-4 right-4 p-2 bg-black bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1">{product.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-black hover:bg-gray-800 text-white p-2 rounded-lg transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}