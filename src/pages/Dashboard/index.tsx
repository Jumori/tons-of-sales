import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Alert, FlatList } from 'react-native';

import api from '../../services/api';
import formatCurrency from '../../utils/formatCurrency';

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
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        const response = await api.get(
          'https://gist.githubusercontent.com/Jumori/c3451ba65a5027470122a81354718193/raw/tonsofsales-server.json',
        );
        setProducts(response.data.products);
      } catch (error) {
        Alert.alert(
          'Sistema indisponível',
          'Ocorreu um erro ao tentar listar as ofertas',
        );
      }
    };

    loadProducts();
  }, []);

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

                <ProductButton testID={`add-to-cart-${item.id}`}>
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
