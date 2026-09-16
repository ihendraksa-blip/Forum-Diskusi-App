import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navigation from '../../components/Navigation';
import authUserReducer from '../../states/authUser/slice';

describe('Navigation Component', () => {
  const mockAuthUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  const createMockStore = (authUser = null) => {
    return configureStore({
      reducer: {
        authUser: authUserReducer,
      },
      preloadedState: {
        authUser,
      },
    });
  };

  it('should render navigation with brand name', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Forum Diskusi')).toBeInTheDocument();
  });

  it('should render login and register links when user is not authenticated', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('nav-login')).toBeInTheDocument();
    expect(screen.getByTestId('nav-register')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-user')).not.toBeInTheDocument();
  });

  it('should render user info and create thread link when user is authenticated', () => {
    const store = createMockStore(mockAuthUser);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('nav-user')).toBeInTheDocument();
    expect(screen.getByTestId('nav-user')).toHaveTextContent('Welcome, Test User');
    expect(screen.getByTestId('nav-create-thread')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-login')).not.toBeInTheDocument();
  });

  it('should render navigation links', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-leaderboard')).toBeInTheDocument();
  });

  it('should have proper navigation styling', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    const nav = container.querySelector('.navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('navigation');
  });

  it('should render brand link pointing to home', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );

    const brandLink = screen.getByText('Forum Diskusi').closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });
});
