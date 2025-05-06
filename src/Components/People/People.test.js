import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import People from './People';

describe('People component', () => {
  it('shows people page', async () => {
    render(<People />);

    expect(screen.getByText(/View All People/i)).toBeInTheDocument();
  });
});
