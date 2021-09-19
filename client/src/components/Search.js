import React, { useState } from 'react';

export default function Search({ handleSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const onSearch = () => {
    handleSearch && handleSearch(searchValue);
  };

  return (
    <div className="message-panel-header">
      <input
        type="text"
        value={searchValue}
        placeholder="Type to search..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button disabled={searchValue.length < 1} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}
