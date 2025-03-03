import { Search } from "lucide-react";
import React, { useCallback, useState } from "react";

// Props interface for the SearchBar component
interface SearchBarProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  query: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  // State for the search input value
  const [query, setQuery] = useState("");

  // Handle input changes and trigger search
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      onSearch(newQuery); // Trigger search on each input change
    },
    [onSearch]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        // Only search if query is not empty
        onSearch(query);
      }
    },
    [query, onSearch]
  );

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Search for books..."
          className=""
        />
        <Search className="search-icon" />
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
