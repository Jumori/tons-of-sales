import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Alert, FlatList } from 'react-native';

import api from '../../services/api';
import formatCurrency from '../../utils/formatCurrency';

import { useCart } from '../../hooks/cart';

import {
  Container,
  ProductContainer,
  ProductCard,
  ProductImage,
  ProductTitle,
  PriceContainer,
  ProductPrice,
  ProductButton,
} from './styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const { addToCart, removeFromCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        const response = await api.get<{ products: Product[] }>(
          'https://gist.githubusercontent.com/Jumori/c3451ba65a5027470122a81354718193/raw/tonsofsales-server.json',
        );
        const parsedResponse = response.data.products.map(item => {
          return { ...item, quantity: 0 };
        });
        setProducts(parsedResponse);
      } catch (error) {
        Alert.alert(
          'Sistema indisponível',
          'Ocorreu um erro ao tentar listar as ofertas',
        );
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (item: Product): Promise<void> => {
    const newProductQuantity = await addToCart(item);
    const updatedProducts = products.map(product => {
      if (product.id === item.id) {
        return { ...product, quantity: newProductQuantity };
      }
      return { ...product };
    });

    setProducts(updatedProducts);
  };

  const handleRemoveFromCart = async (item: Product): Promise<void> => {
    const newProductQuantity = await removeFromCart(item);
    const updatedProducts = products.map(product => {
      if (product.id === item.id) {
        return { ...product, quantity: newProductQuantity };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  return (
    <Container>
      <ProductContainer>
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }) => (
            <ProductCard>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitle>{item.title}</ProductTitle>
              <PriceContainer>
                <ProductPrice>{formatCurrency(item.price)}</ProductPrice>

                {item.quantity > 0 && (
                  <ProductButton
                    testID={`remove-from-cart-${item.id}`}
                    onPress={() => handleRemoveFromCart(item)}
                  >
                    <MaterialCommunityIcons
                      size={20}
                      color="#ff5252"
                      name="minus-circle"
                    />
                  </ProductButton>
                )}

                <ProductButton
                  testID={`add-to-cart-${item.id}`}
                  onPress={() => handleAddToCart(item)}
                >
                  <MaterialCommunityIcons
                    size={20}
                    color="#00ad0c"
                    name="plus-circle"
                  />
                </ProductButton>
              </PriceContainer>
            </ProductCard>
          )}
        />
      </ProductContainer>
    </Container>
  );
};

export default Dashboard;
