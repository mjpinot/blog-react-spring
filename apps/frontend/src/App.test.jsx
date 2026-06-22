import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { App } from './main.jsx';

beforeEach(() => {
  globalThis.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => [
      {
        id: 1,
        title: 'CI pipeline',
        author: 'DevOps',
        content: 'Build, scan, and publish containers.',
        createdAt: '2026-06-22T00:00:00Z'
      }
    ]
  }));
});

test('renders posts from the API', async () => {
  render(<App />);

  await waitFor(() => expect(screen.getByText('CI pipeline')).toBeInTheDocument());
  expect(screen.getByText('Build, scan, and publish containers.')).toBeInTheDocument();
});
