import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import AxiosMock from 'axios-mock-adapter';

import api from '../../services/api';

import Dashboard from '../../pages/Dashboard';

import { useCart } from '../../hooks/cart';

const apiMock = new AxiosMock(api);

jest.mock('@react-navigation/native', () => {
  const originalModule = jest.requireActual('@react-navigation/native');

  return {
    __esModule: true,
    ...originalModule,
    useNavigation: jest.fn(),
  };
});

jest.mock('../../hooks/cart.tsx', () => ({
  __esModule: true,
  useCart: jest.fn().mockReturnValue({
    products: [],
    addToCart: jest.fn().mockReturnValue(1),
  }),
}));

describe('Dashboard', () => {
  it('should be able to list all available products', async () => {
    apiMock
      .onGet(
        'https://gist.githubusercontent.com/Jumori/c3451ba65a5027470122a81354718193/raw/tonsofsales-server.json',
      )
      .reply(200, {
        products: [
          {
            id: '1',
            title: 'Produto 01',
            image_url: 'https://via.placeholder.com/500',
            price: 10,
          },
          {
            id: '2',
            title: 'Produto 02',
            image_url: 'https://via.placeholder.com/500',
            price: 20,
          },
          {
            id: '3',
            title: 'Produto 03',
            image_url: 'https://via.placeholder.com/500',
            price: 30,
          },
          {
            id: '4',
            title: 'Produto 04',
            image_url: 'https://via.placeholder.com/500',
            price: 40,
          },
        ],
      });

    const { getByTestId, getByText } = render(<Dashboard />);

    await waitFor(() => expect(getByTestId('add-to-cart-1')).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText('Produto 01')).toBeTruthy();
    expect(getByTestId('add-to-cart-1')).toBeTruthy();

    expect(getByText('Produto 02')).toBeTruthy();
    expect(getByTestId('add-to-cart-2')).toBeTruthy();
  });

  it('should be able to add item to cart', async () => {
    const { addToCart } = useCart();

    const products = {
      products: [
        {
          id: '1',
          title: 'Produto 01',
          image_url: 'https://via.placeholder.com/500',
          price: 10,
        },
        {
          id: '2',
          title: 'Produto 02',
          image_url: 'https://via.placeholder.com/500',
          price: 20,
        },
        {
          id: '3',
          title: 'Produto 03',
          image_url: 'https://via.placeholder.com/500',
          price: 30,
        },
        {
          id: '4',
          title: 'Produto 04',
          image_url: 'https://via.placeholder.com/500',
          price: 40,
        },
      ],
    };

    apiMock
      .onGet(
        'https://gist.githubusercontent.com/Jumori/c3451ba65a5027470122a81354718193/raw/tonsofsales-server.json',
      )
      .reply(200, products);

    const { getByTestId } = render(<Dashboard />);

    await waitFor(() => expect(getByTestId('add-to-cart-1')).toBeTruthy(), {
      timeout: 200,
    });

    await act(async () => {
      await fireEvent.press(getByTestId('add-to-cart-1'));
    });

    expect(addToCart).toHaveBeenCalledWith({
      ...products.products[0],
      quantity: 0,
    });
    expect(addToCart).toHaveReturnedWith(1);
  });
});
