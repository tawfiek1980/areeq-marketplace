import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, Package, HardHat, Landmark, CheckCircle, XCircle, Trash2, BarChart3, Share2, Phone } from 'lucide-react';
import { auth } from '../lib/auth';
import { adminApi, listingsApi, loadsApi, jobsApi, financeApi } from '../lib/api';
import SocialLinksManager from '../components/admin/SocialLinksManager';
import ContactNumbersManager from '../components/admin/ContactNumbersManager';
import type { Listing, Load, Job, FinanceRequest, User } from '../types';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [financeRequests, setFinanceRequests] = useState<FinanceRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, listingsRes, loadsRes, jobsRes, financeRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        listingsApi.getAll({}),
        loadsApi.getAll({}),
        jobsApi.getAll({}),
        financeApi.getAll(),
        adminApi.getUsers(),
      ]);
      setStats(statsRes.data.data);
      setListings(listingsRes.data.data);
      setLoads(loadsRes.data.data);
      setJobs(jobsRes.data.data);
      setFinanceRequests(financeRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
  );

  const handleApprove = async (id: string) => {
    setIsActionLoading(id);
    try {
      await adminApi.approveListing(id);
      await fetchData();
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('حدث خطأ أثناء الاعتماد');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsActionLoading(id);
    try {
      await adminApi.rejectListing(id);
      await fetchData();
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('حدث خطأ أثناء الرفض');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    setIsActionLoading(id);
    try {
      await listingsApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleUpdateFinanceStatus = async (id: string, status: string) => {
    setIsActionLoading(id);
    try {
      await financeApi.update(id, { status: status as FinanceRequest['status'] });
      await fetchData();
    } catch (error) {
      console.error('Error updating finance:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'listings', name: 'الإعلانات', icon: Truck },
    { id: 'loads', name: 'الحمولات', icon: Package },
    { id: 'jobs', name: 'الوظائف', icon: HardHat },
    { id: 'finance', name: 'طلبات التمويل', icon: Landmark },
    { id: 'users', name: 'المستخدمين', icon: Users },
    { id: 'social', name: 'تواصل اجتماعي', icon: Share2 },
    { id: 'contacts', name: 'أرقام التواصل', icon: Phone },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">لوحة تحكم المدير</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-border pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-orange border-b-2 border-orange' : 'text-text-light hover:text-text'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* ... (Stat Cards content remains the same) ... */}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg">
                <tr>
                  <th className="px-4 py-3 text-right">الإعلان</th>
                  <th className="px-4 py-3 text-right">السعر</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b">
                    <td className="px-4 py-3">{listing.title}</td>
                    <td className="px-4 py-3">{listing.price}</td>
                    <td className="px-4 py-3">{listing.status}</td>
                    <td className="px-4 py-3 flex gap-2">
                      {listing.status === 'pending' && (
                        <>
                          <button disabled={isActionLoading === listing.id} onClick={() => handleApprove(listing.id)} className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 disabled:opacity-50">
                            {isActionLoading === listing.id ? <LoadingSpinner /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </button>
                          <button disabled={isActionLoading === listing.id} onClick={() => handleReject(listing.id)} className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50">
                            {isActionLoading === listing.id ? <LoadingSpinner /> : <XCircle className="w-4 h-4 text-red-600" />}
                          </button>
                        </>
                      )}
                      <button disabled={isActionLoading === listing.id} onClick={() => handleDeleteListing(listing.id)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                        {isActionLoading === listing.id ? <LoadingSpinner /> : <Trash2 className="w-4 h-4 text-gray-600" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* باقي التبويبات (loads, jobs, etc) بنفس المنطق */}
        
        {activeTab === 'social' && <SocialLinksManager />}
        {activeTab === 'contacts' && <ContactNumbersManager />}
      </div>
    </div>
  );
}