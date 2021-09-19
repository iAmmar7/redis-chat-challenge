import React, { useState } from 'react';

export default function Search() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="message-panel-header">
      <input
        type="text"
        value={searchValue}
        placeholder="Type to search..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button disabled={searchValue.length < 1}>Search</button>
    </div>
  );
}
