import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const recentSearches = ['Wool Coat', 'Linen Pants', 'Silk'];

  return (
    <div style={{ padding: '16px', paddingTop: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '12px 16px', borderRadius: '4px', marginBottom: '32px' }}>
        <SearchIcon size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
        <input 
          type="text" 
          placeholder="Search for items..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '16px', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        <h3 className="text-xs" style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>RECENT SEARCHES</h3>
        <ul style={{ listStyle: 'none' }}>
          {recentSearches.map((item, idx) => (
            <li 
              key={idx} 
              style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', fontSize: '14px', cursor: 'pointer' }}
              onClick={() => setQuery(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchView;
