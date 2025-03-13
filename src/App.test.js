import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';
import {homeHeader} from './App';

describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });
it('switches to People view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('View All People'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('View All People')
  });

})