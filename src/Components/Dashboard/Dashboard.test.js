import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event'
import Dashboard from './Dashboard';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../User', () => ({
  getRoles: jest.fn(),
  getEmail: jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    require('../../User').getRoles.mockReturnValue(['ED']);
    require('../../User').getEmail.mockReturnValue('editor@mock.com');
  });

    it('renders the dashboard page', async () => {
        const mockStates = {
          data: {
            SUB: 'Submitted',
            REV: 'In Review',
            CED: 'Copy Edit'
          }
        };

        const mockData = {
            data: {
                1: {
                _id: '1',
                title: 'Mock manuscript',
                author: 'Mock author',
                author_email: 'mock@nyu.com',
                text: 'mock text.',
                abstract: 'Mock abstract.',
                editor_email: 'editor@mock.com',
                state: 'SUB',
                referees: {}
                }
            }
        };
    axios.get.mockResolvedValueOnce(mockStates).mockResolvedValueOnce(mockData);
    render(<Dashboard />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Title: Mock manuscript/i)).toBeInTheDocument();
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
  axios.get.mockImplementation(() =>
    Promise.reject(new Error('Failed to fetch manuscripts'))
  );
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/There was a problem retrieving manuscripts/i)).toBeInTheDocument();
    });
  });
});
