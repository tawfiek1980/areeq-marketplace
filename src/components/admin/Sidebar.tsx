import { LayoutDashboard, Users, Truck, Package, HardHat, Landmark, Share2, Phone } from 'lucide-react';

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'listings', name: 'الإعلانات', icon: Truck },
    { id: 'loads', name: 'الحمولات', icon: Package },
    { id: 'jobs', name: 'الوظائف', icon: HardHat },
    { id: 'finance', name: 'التمويل', icon: Landmark },
    { id: 'users', name: 'المستخدمين', icon: Users },
    { id: 'social', name: 'تواصل', icon: Share2 },
    { id: 'contacts', name: 'أرقام', icon: Phone },
  ];

  return (
    <aside className="w-64 bg-navy text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">طريق - الإدارة</h2>

      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 w-full p-3 rounded-lg ${
              activeTab === tab.id ? 'bg-orange' : 'hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>
    </aside>
  );
}