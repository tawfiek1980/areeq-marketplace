import { MapPin, ArrowLeftRight, Package, Weight, Calendar, MessageCircle } from 'lucide-react';
import type { Load } from '../types';
import { formatPrice, getWhatsAppLink } from '../lib/utils';

interface LoadCardProps {
  load: Load;
}

export default function LoadCard({ load }: LoadCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-navy">
          <MapPin className="w-4 h-4 text-orange" />
          <span>{load.origin}</span>
        </div>
        <ArrowLeftRight className="w-4 h-4 text-text-light" />
        <div className="flex items-center gap-2 text-sm font-bold text-navy">
          <span>{load.destination}</span>
          <MapPin className="w-4 h-4 text-orange" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-bg rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-text-light text-xs mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>نوع الحمول</span>
          </div>
          <p className="font-bold text-sm text-text">{load.cargoType}</p>
        </div>
        <div className="bg-bg rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-text-light text-xs mb-1">
            <Weight className="w-3.5 h-3.5" />
            <span>الوزن</span>
          </div>
          <p className="font-bold text-sm text-text">{load.weight}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-text-light text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{load.date}</span>
        </div>
        <p className="text-xl font-extrabold text-orange">{formatPrice(load.price)}</p>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-text-light line-clamp-1 max-w-[50%]">{load.userName}</span>
        <a
          href={getWhatsAppLink(load.userPhone, `السلام عليكم، أهتم بحمولة من ${load.origin} إلى ${load.destination}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors btn-press"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>تواصل</span>
        </a>
      </div>
    </div>
  );
}
