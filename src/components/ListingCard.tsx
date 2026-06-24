import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, BadgeCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Listing } from '../types';
import { formatPrice, getWhatsAppLink } from '../lib/utils';

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

export default function ListingCard({ listing, featured }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem('tareeq_favorites') || '[]');
    if (!isFavorite) {
      favorites.push(listing.id);
    } else {
      const index = favorites.indexOf(listing.id);
      if (index > -1) favorites.splice(index, 1);
    }
    localStorage.setItem('tareeq_favorites', JSON.stringify(favorites));
  };

  const imageUrl = imageError || !listing.images?.length
    ? `https://placehold.co/400x300/0D1B2A/F4700A?text=${encodeURIComponent(listing.title.slice(0, 20))}`
    : listing.images[0];

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all card-hover ${featured ? 'ring-2 ring-orange/20' : ''}`}
    >
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-orange text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              مميز
            </div>
          )}
          {listing.verified && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-navy text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-orange" />
              مــحقق
            </div>
          )}
          <button
            onClick={toggleFavorite}
            className="absolute bottom-2 left-2 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-text-light'}`} />
          </button>
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/listing/${listing.id}`}>
            <h3 className="font-bold text-text line-clamp-2 text-sm sm:text-base group-hover:text-orange transition-colors">
              {listing.title}
            </h3>
          </Link>
        </div>
        <p className="text-lg sm:text-xl font-extrabold text-orange mt-2">{formatPrice(listing.price)}</p>
        <div className="flex items-center gap-1 text-text-light text-xs mt-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-text-light line-clamp-1 max-w-[50%]">{listing.userName}</span>
          <a
            href={getWhatsAppLink(listing.userPhone, `السلام عليكم، أهتم بإعلانكم على طريق: ${listing.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors btn-press"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
