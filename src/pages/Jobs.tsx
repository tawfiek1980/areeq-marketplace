import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { jobsApi } from '../lib/api';
import { jobTypes, governorates } from '../lib/data';
import type { Job } from '../types';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type') || '';
  const governorate = searchParams.get('governorate') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (governorate) params.governorate = governorate;
        if (search) params.search = search;
        
        const response = await jobsApi.getAll(params);
        setJobs(response.data.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [type, governorate, search]);

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">وظائف النقل واللوجستيات</h1>
            <Link
              to="/post-listing?type=job"
              className="flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">أضف وظيفة</span>
            </Link>
          </div>
          <p className="text-gray-300 text-sm sm:text-base mb-4">اكتشف فرص عمل للسائقين، الميكانيكيين، الفنيين والمتخصصين في مجال النقل الثقيل</p>
          
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="ابحث عن وظيفة أو شركة..."
              className="w-full h-12 pr-12 pl-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Job Type Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-4">
          <button
            onClick={() => updateFilter('type', '')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              !type ? 'bg-orange text-white' : 'bg-white text-text hover:bg-orange/10'
            }`}
          >
            الكل
          </button>
          {jobTypes.map((jt) => (
            <button
              key={jt.id}
              onClick={() => updateFilter('type', jt.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                type === jt.id ? 'bg-orange text-white' : 'bg-white text-text hover:bg-orange/10'
              }`}
            >
              {jt.name}
            </button>
          ))}
        </div>

        {/* Governorate Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('governorate', '')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                !governorate ? 'bg-orange text-white' : 'bg-bg text-text hover:bg-orange/10'
              }`}
            >
              جميع المحافظات
            </button>
            {governorates.slice(0, 12).map((g) => (
              <button
                key={g.id}
                onClick={() => updateFilter('governorate', g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  governorate === g.id ? 'bg-orange text-white' : 'bg-bg text-text hover:bg-orange/10'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Filter className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-2">لا توجد وظائف</h3>
            <p className="text-text-light text-sm mb-4">جرّب تغيير الفلاتر أو أضف وظيفة جديدة</p>
            <Link
              to="/post-listing?type=job"
              className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              أضف وظيفة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
