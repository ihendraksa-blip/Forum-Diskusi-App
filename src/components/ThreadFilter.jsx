const ThreadFilter = ({ categories, filter, setFilter }) => {
  return (
    <div className="thread-filter">
      <label htmlFor="category-filter">Filter by Category:</label>
      <select
        id="category-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThreadFilter;
