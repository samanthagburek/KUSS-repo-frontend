import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event'
import Dashboard from './Dashboard';
import axios from 'axios';

jest.mock('axios');

describe('Dashboard', () => {
    it('renders the dashboard page', async () => {
        const mockData = {
            data: {
                1: {
                title: 'Mock manuscript',
                author: 'Mock author',
                author_email: 'mock@nyu.com',
                text: 'mock text.',
                abstract: 'Mock abstract.',
                editor_email: 'editor@mock.com',
                referee: ''
                }
            }
        };
    axios.get.mockResolvedValueOnce(mockData);
    render(<Dashboard />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Mock manuscript/i)).toBeInTheDocument();
      expect(screen.getByText(/Author: Mock author/i)).toBeInTheDocument();
      expect(screen.getByText(/Author Email: mock@nyu.com/i)).toBeInTheDocument();
      expect(screen.getByText(/Text: mock text./i)).toBeInTheDocument();
      expect(screen.getByText(/Abstract: Mock abstract./i)).toBeInTheDocument();
      expect(screen.getByText(/Editor Email: editor@mock.com/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });
it('handles error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch manuscripts'));
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/There was a problem retrieving manuscripts/i)).toBeInTheDocument();
    });
  });
});
