import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './Home';

jest.mock('axios');

describe('Home', () => {
    it('fetches and displays about', async () => {
    const mockData = {
      data: { 
        1: { key: 'about_us', text: 'Welcome to the KUSS Journal!' } 
      }
    };

    axios.get.mockResolvedValueOnce(mockData);
    render(<Home />);
    expect(screen.getByText(/The KUSS Journal/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Welcome to the KUSS Journal!/i)).toBeInTheDocument();
    });
  });

    it('handles API error', async () => {
        axios.get.mockRejectedValueOnce(new Error('Something is wrong'));
        render(<Home />);
        await waitFor(() => {
      expect(screen.getByText(/Error fetching about us data/i)).toBeInTheDocument();
    });
  });
});