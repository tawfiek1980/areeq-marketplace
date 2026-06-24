import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X } from 'lucide-react';

interface SearchBarProps {
  variant?: 'hero' | 'header' | 'mobile';
  onClose?: () => void;
}

export default function SearchBar({ variant = 'hero', onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !location.trim()) return;
    
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (location.trim()) params.set('governorate', location.trim());
    
    navigate(`/vehicles?${params.toString()}`);
    if (onClose) onClose();
  };

  if (variant === 'header') {
    return (
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن شاحنات، معدات، حمولات..."
          className="w-full h-10 pr-10 pl-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-orange/50 text-sm"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    );
  }

  if (variant === 'mobile') {
    return (
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في طريق..."
          className="w-full h-12 pr-10 pl-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange/50"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن شاحنات، معدات ثقيلة، حمولات..."
            className="w-full h-12 sm:h-14 pr-12 pl-4 bg-bg rounded-xl border border-transparent focus:border-orange focus:bg-white focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative sm:w-48">
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="الموقع"
            className="w-full h-12 sm:h-14 pr-12 pl-4 bg-bg rounded-xl border border-transparent focus:border-orange focus:bg-white focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="h-12 sm:h-14 px-8 bg-orange hover:bg-orange-dark text-white font-bold rounded-xl transition-colors btn-press flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span>بحث</span>
        </button>
      </div>
    </form>
  );
}
