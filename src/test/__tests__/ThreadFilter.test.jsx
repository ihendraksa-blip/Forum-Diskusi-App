import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThreadFilter from '../../components/ThreadFilter';

describe('ThreadFilter Component', () => {
  const mockCategories = ['General', 'Tech', 'News', 'Programming'];
  const mockSetFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render filter label and select element', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    expect(screen.getByLabelText('Filter by Category:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render "All Categories" as default option', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select.value).toBe('');
  });

  it('should render all category options', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    const options = Array.from(select.options);

    expect(options).toHaveLength(5); // "All Categories" + 4 categories
    expect(options[0].text).toBe('All Categories');
    expect(options[1].text).toBe('General');
    expect(options[2].text).toBe('Tech');
    expect(options[3].text).toBe('News');
    expect(options[4].text).toBe('Programming');
  });

  it('should call setFilter when category is selected', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Tech' } });

    expect(mockSetFilter).toHaveBeenCalledWith('Tech');
  });

  it('should display selected category as current value', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter="Programming"
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select.value).toBe('Programming');
  });

  it('should handle empty categories array', () => {
    render(
      <ThreadFilter
        categories={[]}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    const options = Array.from(select.options);

    expect(options).toHaveLength(1); // Only "All Categories"
    expect(options[0].text).toBe('All Categories');
  });

  it('should handle single category', () => {
    const singleCategory = ['General'];

    render(
      <ThreadFilter
        categories={singleCategory}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const select = screen.getByRole('combobox');
    const options = Array.from(select.options);

    expect(options).toHaveLength(2); // "All Categories" + 1 category
    expect(options[1].text).toBe('General');
  });

  it('should maintain accessibility with proper label association', () => {
    render(
      <ThreadFilter
        categories={mockCategories}
        filter=""
        setFilter={mockSetFilter}
      />
    );

    const label = screen.getByText('Filter by Category:');
    const select = screen.getByRole('combobox');

    expect(label).toBeInTheDocument();
    expect(select).toHaveAttribute('id');
    expect(label).toHaveAttribute('htmlFor', select.id);
  });
});
