import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import People from './People';

describe('People component', () => {
  it('shows form when add-person button is clicked', async () => {
    render(<People />);

    await userEvent.click(screen.getByText('Add a Person'));
    await screen.findAllByRole('textbox');

    expect(screen.getAllByRole('textbox')).toHaveLength(2);

  });
});
