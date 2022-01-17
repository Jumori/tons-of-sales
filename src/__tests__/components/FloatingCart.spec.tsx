import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

import FloatingCart from '../../componentes/FloatingCart';

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
    addToCart: jest.fn(),
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
  }),
}));

jest.mock('../../utils/formatCurrency.ts', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(value => value),
}));

describe('FloatingCart component', () => {
  it('should be able to calculate the cart total price', async () => {
    const { getByText } = render(<FloatingCart />);

    expect(getByText('110')).toBeTruthy();
  });

  it('should be able to show the total of itens in the cart', async () => {
    const { getByText } = render(<FloatingCart />);

    expect(getByText('7 itens')).toBeTruthy();
  });

  it('should be able to navigate to the cart', async () => {
    const { getByTestId } = render(<FloatingCart />);

    act(() => {
      fireEvent.press(getByTestId('navigate-to-cart-button'));
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
