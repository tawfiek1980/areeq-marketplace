import { Link, useLocation } from 'react-router-dom';
import { Home, Truck, Package, HardHat, User, Menu } from 'lucide-react';

const bottomNavItems = [
  { name: 'الرئيسية', path: '/', icon: Home },
  { name: 'الشاحنات', path: '/vehicles', icon: Truck },
  { name: 'الحمولات', path: '/loads', icon: Package },
  { name: 'الوظائف', path: '/jobs', icon: HardHat },
  { name: 'حسابي', path: '/profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                isActive ? 'text-orange' : 'text-text-light hover:text-navy'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
