import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): Promise<number>;
  removeFromCart(item: Product): Promise<number>;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      const storedProducts = await AsyncStorage.getItem(
        '@TonsOfSales:products',
      );

      if (storedProducts) {
        setProducts([...JSON.parse(storedProducts)]);
      }
    };

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExists = products.find(item => item.id === product.id);
      let productsUpdated = [];

      if (productExists) {
        productsUpdated = products.map(item => {
          if (item.id === product.id) {
            return { ...product, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        productsUpdated = [...products, { ...product, quantity: 1 }];
      }

      setProducts(productsUpdated);

      // Update async storage
      await AsyncStorage.setItem(
        '@TonsOfSales:products',
        JSON.stringify(productsUpdated),
      );

      return productExists ? productExists.quantity + 1 : 0;
    },
    [products],
  );

  const removeFromCart = useCallback(
    async product => {
      const productExists = products.find(item => item.id === product.id);
      let productsUpdated = [];

      if (productExists) {
        productsUpdated = products.map(item => {
          if (item.id === product.id) {
            return {
              ...product,
              quantity: 0,
            };
          }
          return item;
        });
      } else {
        productsUpdated = [...products, { ...product, quantity: 0 }];
      }

      setProducts(productsUpdated);

      // Update async storage
      await AsyncStorage.setItem(
        '@TonsOfSales:products',
        JSON.stringify(productsUpdated),
      );

      return productExists ? productExists.quantity - 1 : 0;
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ products, addToCart, removeFromCart }),
    [products, addToCart, removeFromCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = (): CartContext => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export { CartProvider, useCart };
