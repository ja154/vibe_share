import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainApp from './components/MainApp';
import { supabase } from './lib/supabase';

// Mocking supabase
jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
        order: jest.fn(() => ({
          // Mocking the promise-like behavior
          then: jest.fn(callback => callback({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        // Mocking the promise-like behavior
        then: jest.fn(callback => callback({ error: null })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          // Mocking the promise-like behavior
          then: jest.fn(callback => callback({ error: null })),
        })),
      })),
    })),
  },
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockProfile = {
  name: 'Test User',
  avatar_url: 'https://example.com/avatar.png',
};

const mockPosts = [
  {
    id: 'post-1',
    user_id: 'test-user-id',
    title: 'Test Post 1',
    description: 'This is the first test post.',
    created_at: new Date().toISOString(),
    tags: ['react', 'testing'],
    media_url: 'https://example.com/image.png',
    code_link: 'https://github.com',
  },
  {
    id: 'post-2',
    user_id: 'another-user-id',
    title: 'Test Post 2',
    description: 'This is the second test post.',
    created_at: new Date().toISOString(),
    tags: ['supabase', 'vite'],
    media_url: null,
    code_link: null,
  },
];

describe('MainApp User Flow Simulation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock supabase calls
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    const insertMock = jest.fn().mockResolvedValue({ error: null });
    const fromMock = jest.fn((tableName) => {
      const baseMock = {
        select: jest.fn().mockReturnThis(),
        insert: insertMock,
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      if (tableName === 'posts') {
        baseMock.order = jest.fn().mockResolvedValue({ data: mockPosts, error: null });
      }
      if (tableName === 'profiles') {
        baseMock.single = jest.fn().mockResolvedValue({ data: mockProfile, error: null });
      }

      return baseMock;
    });

    supabase.from = fromMock;
  });

  test('should render MainApp and display posts', async () => {
    await act(async () => {
      render(<MainApp user={mockUser} onSignOut={() => {}} />);
    });

    // Check for welcome message
    expect(await screen.findByText(/Welcome back/)).toBeInTheDocument();

    // Check if posts are rendered
    expect(await screen.findByText('Test Post 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Post 2')).toBeInTheDocument();

    // Check for post details
    expect(screen.getByText('This is the first test post.')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
    expect(screen.getByText('View Code')).toBeInTheDocument();
  });

  test('should open and close the create post modal', async () => {
    await act(async () => {
      render(<MainApp user={mockUser} onSignOut={() => {}} />);
    });

    // Open the modal
    fireEvent.click(screen.getByText('Create Post'));
    expect(await screen.findByText('Create New Post')).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
    });
  });

  test('should allow creating a new post', async () => {
    const onPostCreated = jest.fn();
    await act(async () => {
      render(<MainApp user={mockUser} onSignOut={() => {}} />);
    });

    // Open the modal
    fireEvent.click(screen.getByText('Create Post'));
    expect(await screen.findByText('Create New Post')).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('What did you build?'), {
      target: { value: 'New Test Post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tell us about your project...'), {
      target: { value: 'A new post for testing.' },
    });
    fireEvent.change(screen.getByPlaceholderText('react, javascript, web-dev (comma separated)'), {
      target: { value: 'new,test' },
    });

    // Submit the form
    const modal = screen.getByRole('dialog');
    fireEvent.click(within(modal).getByRole('button', { name: /Create Post/i }));

    // Check if the insert was called with the correct data
    await waitFor(() => {
        expect(supabase.from('posts').insert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        title: 'New Test Post',
        description: 'A new post for testing.',
        media_url: null,
        code_link: null,
        tags: ['new', 'test'],
      });
    });
  });
});
