import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, MapPin } from 'lucide-react';
import LoadCard from '../components/LoadCard';
import { loadsApi } from '../lib/api';
import { governorates, cargoTypes } from '../lib/data';
import type { Load } from '../types';
import { Link } from 'react-router-dom';

export default function Loads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const cargoType = searchParams.get('cargoType') || '';

  useEffect(() => {
    const fetchLoads = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (origin) params.origin = origin;
        if (destination) params.destination = destination;
        if (cargoType) params.search = cargoType;
        
        const response = await loadsApi.getAll(params);
        setLoads(response.data.data);
      } catch (error) {
        console.error('Error fetching loads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, [origin, destination, cargoType]);

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">سوق الحمولات</h1>
            <Link
              to="/post-listing?type=load"
              className="flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">أضف حمولة</span>
            </Link>
          </div>
          <p className="text-gray-300 text-sm sm:text-base mb-4">ابحث عن حمولات جاهزة أو أضف حمولتك لايجدها الشاحن المناسب</p>
          
          <div className="bg-white rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <select
                value={origin}
                onChange={(e) => updateFilter('origin', e.target.value)}
                className="w-full h-11 pr-10 pl-3 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-sm"
              >
                <option value="">من المحافظة</option>
                {governorates.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <select
                value={destination}
                onChange={(e) => updateFilter('destination', e.target.value)}
                className="w-full h-11 pr-10 pl-3 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-sm"
              >
                <option value="">إلى المحافظة</option>
                {governorates.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <select
                value={cargoType}
                onChange={(e) => updateFilter('cargoType', e.target.value)}
                className="w-full h-11 pr-10 pl-3 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-sm"
              >
                <option value="">نوع الحمول</option>
                {cargoTypes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : loads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Filter className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-2">لا توجد حمولات</h3>
            <p className="text-text-light text-sm mb-4">جرّب تغيير الفلاتر أو أضف حمولتك الآن</p>
            <Link
              to="/post-listing?type=load"
              className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              أضف حمولة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loads.map((load) => (
              <LoadCard key={load.id} load={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
