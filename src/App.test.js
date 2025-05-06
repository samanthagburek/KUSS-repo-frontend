/* import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';
import {homeHeader} from './App';

describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });
it('switches to Login view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Login'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('Login')
  });

}) */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the User module
jest.mock('./User', () => ({
  getEmail: jest.fn(),
}));

describe('App', () => {
  it('redirects to login when not logged in', () => {
    require('./User').getEmail.mockReturnValue("");
    
    render(<App />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Log In');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders nav and home when logged in', () => {
    require('./User').getEmail.mockReturnValue("user@example.com");
    
    render(<App />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
  });

  it('switches to Login view when clicking login link', async () => {
    require('./User').getEmail.mockReturnValue("user@example.com");
    
    render(<App />);
    
    const allLoginElements = screen.getAllByText(/Log In/i);
  
    expect(allLoginElements).toHaveLength(2);
  
    await userEvent.click(allLoginElements[1]);
  
    expect(screen.getByRole('heading')).toHaveTextContent('Log In');
  });
});