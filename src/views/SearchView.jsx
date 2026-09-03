import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import FeedCard from '../components/FeedCard';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products } = useAppContext();

  // Basic search logic
  const searchResults = query.trim() === '' 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ padding: '16px', paddingTop: '40px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: '16px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        <SearchIcon size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
        <input 
          type="text" 
          placeholder="Cari tas impianmu..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        {query.trim() !== '' ? (
          <div>
            <h3 className="text-sm" style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              HASIL PENCARIAN ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {searchResults.map(product => (
                  <FeedCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                Tidak menemukan tas dengan nama "{query}"
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xs" style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>PENCARIAN POPULER</h3>
            <ul style={{ listStyle: 'none' }}>
              {['Tote Bag', 'Sling Bag', 'Backpack'].map((item, idx) => (
                <li 
                  key={idx} 
                  style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', fontSize: '14px', cursor: 'pointer', color: 'var(--text-primary)' }}
                  onClick={() => setQuery(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
