import { render, screen, waitFor } from '@testing-library/react';
import App from './App'; // ✅ FIXED: Import actual component, not itself

// Mock fetch globally
global.fetch = jest.fn();

describe('NewsHub App', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders NewsHub header', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [] }),
    });

    render(<App />);
    const headerElement = await screen.findByText(/NewsHub/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [] }),
    });

    render(<App />);
    expect(screen.getByText(/Loading latest news/i)).toBeInTheDocument();
  });

  test('displays articles after loading', async () => {
    const mockArticles = [
      {
        title: 'Test Article',
        description: 'Test Description',
        url: 'https://example.com',
        image: 'https://example.com/image.jpg',
        source: { name: 'Test Source' },
        publishedAt: new Date().toISOString(),
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  test('shows error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
