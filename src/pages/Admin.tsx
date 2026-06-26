import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/auth";
import { adminApi } from "../lib/api";

import Sidebar from "../components/admin/Sidebar";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardCards from "../components/admin/DashboardCards";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const user = auth.getUser();

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6">
        {activeTab === "dashboard" && (
          <DashboardCards stats={stats} />
        )}

        {activeTab !== "dashboard" && (
          <div className="text-gray-500">
            الصفحة: {activeTab}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}