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

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveListing(id);
      fetchData();
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectListing(id);
      fetchData();
    } catch (error) {
      console.error('Error rejecting listing:', error);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await listingsApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleUpdateFinanceStatus = async (id: string, status: string) => {
    try {
      await financeApi.update(id, { status: status as FinanceRequest['status'] });
      fetchData();
    } catch (error) {
      console.error('Error updating finance:', error);
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

  if (loading) {
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
          <p className="text-gray-300 text-sm">إدارة الإعلانات، المستخدمين، طلبات التمويل، وصفحات التواصل</p>
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
            {[
              { label: 'إجمالي الإعلانات', value: stats.listings, icon: Truck },
              { label: 'إعلانات معلقة', value: stats.pendingListings, icon: BarChart3, color: 'text-yellow-500' },
              { label: 'الحمولات', value: stats.loads, icon: Package },
              { label: 'الوظائف', value: stats.jobs, icon: HardHat },
              { label: 'طلبات التمويل', value: stats.financeRequests, icon: Landmark },
              { label: 'طلبات جديدة', value: stats.newFinanceRequests, icon: Landmark, color: 'text-green-500' },
              { label: 'المستخدمين', value: stats.users, icon: Users },
              { label: 'الرسائل', value: stats.messages, icon: BarChart3 },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color || 'text-orange'}`} />
                </div>
                <div>
                  <p className="text-xs text-text-light">{stat.label}</p>
                  <p className="text-xl font-extrabold text-navy">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-text">الإعلان</th>
                    <th className="px-4 py-3 text-right font-bold text-text">السعر</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الحالة</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-bg/50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-text line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-text-light">{listing.location}</p>
                      </td>
                      <td className="px-4 py-3 text-orange font-bold">{listing.price?.toLocaleString('ar-EG')} ج</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          listing.status === 'active' ? 'bg-green-100 text-green-600' :
                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {listing.status === 'active' ? 'فعال' : listing.status === 'pending' ? 'معلق' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {listing.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(listing.id)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="اعتماد">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(listing.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="رفض">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteListing(listing.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'loads' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-text">المسار</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الحمول</th>
                    <th className="px-4 py-3 text-right font-bold text-text">السعر</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loads.map((load) => (
                    <tr key={load.id} className="hover:bg-bg/50">
                      <td className="px-4 py-3">{load.origin} → {load.destination}</td>
                      <td className="px-4 py-3">{load.cargoType} ({load.weight})</td>
                      <td className="px-4 py-3 text-orange font-bold">{load.price?.toLocaleString('ar-EG')} ج</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-1 rounded-lg bg-green-100 text-green-600">فعال</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-text">الوظيفة</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الشركة</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الموقع</th>
                    <th className="px-4 py-3 text-right font-bold text-text">النوع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-bg/50">
                      <td className="px-4 py-3 font-bold text-text">{job.title}</td>
                      <td className="px-4 py-3">{job.company}</td>
                      <td className="px-4 py-3">{job.location}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-1 rounded-lg bg-orange/10 text-orange">{job.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-text">الاسم</th>
                    <th className="px-4 py-3 text-right font-bold text-text">المركبة</th>
                    <th className="px-4 py-3 text-right font-bold text-text">السعر</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {financeRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-bg/50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-text">{request.name}</p>
                        <p className="text-xs text-text-light">{request.phone}</p>
                      </td>
                      <td className="px-4 py-3">{request.vehicleType}</td>
                      {/* تم إضافة ? هنا لتفادي خطأ undefined في السعر */}
                      <td className="px-4 py-3 text-orange font-bold">{request.vehiclePrice?.toLocaleString('ar-EG')} ج</td>
                      <td className="px-4 py-3">
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateFinanceStatus(request.id, e.target.value)}
                          className="h-8 px-2 bg-bg rounded-lg border border-border text-xs font-bold"
                        >
                          <option value="new">جديد</option>
                          <option value="reviewing">قيد المراجعة</option>
                          <option value="approved">معتمد</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-text">الاسم</th>
                    <th className="px-4 py-3 text-right font-bold text-text">البريد</th>
                    <th className="px-4 py-3 text-right font-bold text-text">الهاتف</th>
                    <th className="px-4 py-3 text-right font-bold text-text">النوع</th>
                    <th className="px-4 py-3 text-right font-bold text-text">التحقق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-bg/50">
                      <td className="px-4 py-3 font-bold text-text">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.phone}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-1 rounded-lg bg-bg">{user.type}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {user.verified ? 'محقق' : 'غير محقق'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'social' && <SocialLinksManager />}
        {activeTab === 'contacts' && <ContactNumbersManager />}
      </div>
    </div>
  );
}