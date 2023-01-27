import React from 'react';
import { render } from '@testing-library/react';
import Landing from '../../pages/Landing';
import { MemoryRouter } from 'react-router-dom';

describe('test landing page', () => {
  test('renders component correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    const helloText = getByText(/Make Cards That Pop?/i);
    expect(helloText).toBeInTheDocument();
  });
});
