import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

import Cart from '../../pages/Cart';
import { useCart } from '../../hooks/cart';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const originalModule = jest.requireActual('@react-navigation/native');

  return {
    __esModule: true,
    ...originalModule,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('../../hooks/cart.tsx', () => ({
  __esModule: true,
  useCart: jest.fn().mockReturnValue({
    products: [
      {
        id: '1',
        title: 'Produto 01',
        image_url: 'https://via.placeholder.com/500',
        price: 10,
        quantity: 5,
      },
      {
        id: '2',
        title: 'Produto 02',
        image_url: 'https://via.placeholder.com/500',
        price: 20,
        quantity: 0,
      },
      {
        id: '3',
        title: 'Produto 03',
        image_url: 'https://via.placeholder.com/500',
        price: 30,
        quantity: 2,
      },
      {
        id: '4',
        title: 'Produto 04',
        image_url: 'https://via.placeholder.com/500',
        price: 40,
        quantity: 0,
      },
    ],
    addToCart: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  }),
}));

jest.mock('../../utils/formatCurrency.ts', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(value => value),
}));

describe('Cart', () => {
  it('should be able to list products on the cart', async () => {
    const { getByText } = render(<Cart />);

    expect(getByText('Produto 01')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('50')).toBeTruthy();
    expect(getByText('5x')).toBeTruthy();

    expect(getByText('Produto 03')).toBeTruthy();
    expect(getByText('30')).toBeTruthy();
    expect(getByText('60')).toBeTruthy();
    expect(getByText('2x')).toBeTruthy();
  });

  it('should be able to calculate the cart total price', async () => {
    const { getByText } = render(<Cart />);

    expect(getByText('110')).toBeTruthy();
  });

  it('should be able to calculate the cart total of itens', async () => {
    const { getByText } = render(<Cart />);

    expect(getByText('7 itens')).toBeTruthy();
  });

  it('should be able to increment product quantity on the cart', async () => {
    const { increment } = useCart();
    const { getByTestId } = render(<Cart />);

    act(() => {
      fireEvent.press(getByTestId('increment-1'));
    });

    expect(increment).toHaveBeenCalledWith('1');
  });

  it('should be able to decrement product quantity on the cart', async () => {
    const { decrement } = useCart();
    const { getByTestId } = render(<Cart />);

    expect(getByTestId('decrement-3')).toBeTruthy();

    act(() => {
      fireEvent.press(getByTestId('decrement-3'));
    });

    expect(decrement).toHaveBeenCalledWith('3');
  });
});
