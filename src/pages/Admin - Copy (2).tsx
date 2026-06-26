import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/auth';
import {
  adminApi,
  listingsApi,
  loadsApi,
  jobsApi,
  financeApi
} from '../lib/api';

import Sidebar from '../components/admin/Sidebar';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardCards from '../components/admin/DashboardCards';

// 1. تعريف واجهة للـ stats لضمان النوعية
interface DashboardStats {
  totalUsers?: number;
  totalListings?: number;
  totalRevenue?: number;
  // أضف أي حقول أخرى متوقعة من الـ API
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 2. استخدام الواجهة بدلًا من any
  const [stats, setStats] = useState<DashboardStats>({});

  useEffect(() => {
    // اختبار مؤقت: للتأكد من الريندر والحالة
    console.log("Admin Rendered", { activeTab, stats });

    if (!auth.isAdmin()) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [activeTab, stats]); // إضافة activeTab و stats للمراقبة أثناء الاختبار

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.data || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <DashboardCards stats={stats} />
          )}

          {activeTab !== 'dashboard' && (
            <div className="text-gray-500">
              الصفحة: {activeTab}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}