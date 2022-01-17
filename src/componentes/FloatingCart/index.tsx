import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  CartPricing,
  CartTotalPrice,
  CartButton,
  CartButtonText,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatCurrency from '../../utils/formatCurrency';

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const navigation = useNavigation();

  const cartTotalPrice = useMemo(() => {
    const totalPrice = products.reduce((accumulator, product) => {
      const productSubtotal = product.price * product.quantity;

      return accumulator + productSubtotal;
    }, 0);

    return formatCurrency(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalQuantity = products.reduce((accumulator, product) => {
      const productQuantity = product.quantity;

      return accumulator + productQuantity;
    }, 0);

    return totalQuantity;
  }, [products]);

  const handleNavigateToCart = () => {
    navigation.navigate('Cart' as never, {} as never);
  };

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={handleNavigateToCart}
      >
        <MaterialCommunityIcons name="cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotalPrice}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
