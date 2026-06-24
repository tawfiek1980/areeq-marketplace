import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  to?: string;
}

export default function CategoryCard({ category, to }: CategoryCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[category.icon] || Icons.Circle;

  return (
    <Link
      to={to || `/${category.id === 'trucks' ? 'vehicles' : category.id}`}
      className="group flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-border hover:border-orange/30 hover:shadow-md transition-all card-hover"
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${category.color}15` }}
      >
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: category.color }} />
      </div>
      <span className="text-xs sm:text-sm font-bold text-text text-center leading-tight line-clamp-2">
        {category.name}
      </span>
      <span className="text-[10px] sm:text-xs text-text-light">{category.count.toLocaleString('ar-EG')} إعلان</span>
    </Link>
  );
}
