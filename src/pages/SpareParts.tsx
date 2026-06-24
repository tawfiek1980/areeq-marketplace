import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { listingsApi } from '../lib/api';
import { governorates } from '../lib/data';
import type { Listing } from '../types';

const sparePartCategories = [
  { id: 'engine', name: 'محركات' },
  { id: 'transmission', name: 'فتيس الحركة' },
  { id: 'brakes', name: 'فرامل' },
  { id: 'tires', name: 'إطارات' },
  { id: 'electrical', name: 'كهربائيات' },
  { id: 'body', name: 'بدي وكبائن' },
  { id: 'filters', name: 'فلاتر' },
  { id: 'oils', name: 'زيوت وشحن' },
];

export default function SpareParts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const subcategory = searchParams.get('subcategory') || '';
  const governorate = searchParams.get('governorate') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { category: 'spare-parts' };
        if (subcategory) params.subcategory = subcategory;
        if (governorate) params.governorate = governorate;
        if (search) params.search = search;
        
        const response = await listingsApi.getAll(params);
        setListings(response.data.data);
      } catch (error) {
        console.error('Error fetching spare parts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [subcategory, governorate, search]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">سوق القطع الغيار</h1>
            <Link
              to="/post-listing?category=spare-parts"
              className="flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">أضف قطعة</span>
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="ابحث عن قطعة غيار..."
              className="w-full h-12 pr-12 pl-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-4">
          <button
            onClick={() => updateFilter('subcategory', '')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              !subcategory ? 'bg-orange text-white' : 'bg-white text-text hover:bg-orange/10'
            }`}
          >
            الكل
          </button>
          {sparePartCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('subcategory', cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                subcategory === cat.id ? 'bg-orange text-white' : 'bg-white text-text hover:bg-orange/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <select
              value={governorate}
              onChange={(e) => updateFilter('governorate', e.target.value)}
              className="h-10 px-3 bg-white rounded-xl border border-border focus:border-orange focus:outline-none text-sm"
            >
              <option value="">جميع المحافظات</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <span className="text-sm text-text-light">{listings.length} نتيجة</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange text-white' : 'text-text-light hover:text-text'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange text-white' : 'text-text-light hover:text-text'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Filter className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-2">لا توجد قطع غيار</h3>
            <p className="text-text-light text-sm mb-4">جرّب تغيير الفلاتر أو أضف قطعتك</p>
            <Link
              to="/post-listing?category=spare-parts"
              className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              أضف قطعة
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
