import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Landmark, Truck, Package, HardHat, ChevronLeft } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ListingCard from '../components/ListingCard';
import LoadCard from '../components/LoadCard';
import JobCard from '../components/JobCard';
import MarketStat from '../components/MarketStat';
import { mainCategories, marketStats, governorates } from '../lib/data';
import { listingsApi, loadsApi, jobsApi } from '../lib/api';
import type { Listing, Load, Job } from '../types';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [latestLoads, setLatestLoads] = useState<Load[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, loadsRes, jobsRes] = await Promise.all([
          listingsApi.getFeatured().catch(() => ({ data: { data: [] } })),
          loadsApi.getAll({ status: 'available' }).catch(() => ({ data: { data: [] } })),
          jobsApi.getAll({}).catch(() => ({ data: { data: [] } })),
        ]);
        setFeaturedListings(listingsRes.data.data.slice(0, 6));
        setLatestLoads(loadsRes.data.data.slice(0, 4));
        setLatestJobs(jobsRes.data.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80"
            alt="Trucks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              أكبر سوق إلكتروني لنقل <span className="gradient-text">الثقيل</span> في مصر
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              ابحث عن شاحنات، حمولات، معدات ثقيلة، وظائف، تمويل وخدمات طوارئ في مكان واحد
            </p>
          </motion.div>
          <SearchBar />
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-6 sm:py-8 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {mainCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Financing Banner */}
      <section className="py-4 sm:py-6 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/finance">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy to-navy-light p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white">
                    تمويل نقل ثقيل حتى <span className="text-orange">4 ملايين جنيه</span>
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1">
                    أمل حصولك على شاحنة أو معدة ثقيلة بأقساط مرونة تبدأ من 10%
                  </p>
                </div>
              </div>
              <div className="relative flex items-center gap-2 text-orange font-bold text-sm sm:text-base">
                <span>التفاصيل</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-6 sm:py-8 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-navy">إعلانات مميزة</h2>
            </div>
            <Link to="/vehicles" className="flex items-center gap-1 text-orange font-bold text-sm hover:underline">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} featured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Loads */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-navy">أحدث الحمولات</h2>
            </div>
            <Link to="/loads" className="flex items-center gap-1 text-orange font-bold text-sm hover:underline">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-bg rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestLoads.map((load) => (
                <LoadCard key={load.id} load={load} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-6 sm:py-8 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-navy">فرص العمل</h2>
            </div>
            <Link to="/jobs" className="flex items-center gap-1 text-orange font-bold text-sm hover:underline">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-navy">مؤشرات السوق</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {marketStats.map((stat, index) => (
              <MarketStat key={index} stat={stat} />
            ))}
          </div>
          
          <div className="bg-bg rounded-2xl p-4 sm:p-6">
            <h3 className="font-bold text-navy mb-4">أكثر المحافظات نشاطاً</h3>
            <div className="flex flex-wrap gap-2">
              {governorates.slice(0, 10).map((gov) => (
                <Link
                  key={gov.id}
                  to={`/vehicles?governorate=${gov.id}`}
                  className="px-3 py-1.5 bg-white rounded-lg text-xs sm:text-sm font-medium text-text hover:bg-orange hover:text-white transition-colors border border-border"
                >
                  {gov.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
