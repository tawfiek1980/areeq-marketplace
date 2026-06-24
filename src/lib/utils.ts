export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} مليون جنيه`;
  }
  if (price >= 1000) {
    return `${price.toLocaleString('ar-EG')} جنيه`;
  }
  return `${price.toLocaleString('ar-EG')} جنيه`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'منذ دقائق';
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInHours < 48) return 'منذ يوم';
  if (diffInHours < 168) return `منذ ${Math.floor(diffInHours / 24)} أيام`;
  
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone.startsWith('20') ? cleanPhone : '20' + cleanPhone}?text=${text}`;
};

export const getPhoneLink = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `tel:${cleanPhone.startsWith('20') ? '+' + cleanPhone : '+20' + cleanPhone}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
