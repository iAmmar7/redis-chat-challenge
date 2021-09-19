import React, { useState } from 'react';

export default function Search({ handleSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    handleSearch && handleSearch(searchValue);
    setSearchValue('');
  };

  return (
    <div className="message-panel-header">
      <form onSubmit={onSearch}>
        <input
          type="text"
          value={searchValue}
          placeholder="Type to search..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button disabled={searchValue.length < 1} type="submit">
          Search
        </button>
      </form>
    </div>
  );
}
