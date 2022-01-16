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
  increment(id: string): void;
  decrement(id: string): void;
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

      await AsyncStorage.setItem(
        '@TonsOfSales:products',
        JSON.stringify(productsUpdated),
      );

      return productExists ? productExists.quantity + 1 : 0;
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productsUpdated = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }

        return product;
      });

      setProducts(productsUpdated);

      await AsyncStorage.setItem(
        '@TonsOfSales:products',
        JSON.stringify(productsUpdated),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productsUpdated = products
        .map(product => {
          if (product.id === id) {
            return { ...product, quantity: product.quantity - 1 };
          }

          return product;
        })
        .filter(product => product.quantity > 0);

      setProducts(productsUpdated);

      await AsyncStorage.setItem(
        '@TonsOfSales:products',
        JSON.stringify(productsUpdated),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ products, addToCart, increment, decrement }),
    [products, addToCart, increment, decrement],
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
