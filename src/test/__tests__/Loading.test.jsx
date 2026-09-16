import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../../components/Loading';

describe('Loading Component', () => {
  it('should render loading container', () => {
    render(<Loading />);
    const container = screen.getByText('Loading...');
    expect(container).toBeInTheDocument();
  });

  it('should render loading spinner', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render loading text', () => {
    render(<Loading />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toBeInTheDocument();
  });

  it('should be accessible with proper structure', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toHaveAttribute('class');
  });

  it('should have spinner with animation class', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading-spinner');
  });

  it('should render with proper semantic structure', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer.tagName).toBe('DIV');
  });
});
