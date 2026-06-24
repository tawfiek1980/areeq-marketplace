import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Loader2 } from 'lucide-react';
import { socialLinksApi, contactNumbersApi } from '../lib/api';
import { getPhoneLink, getWhatsAppLink } from '../lib/utils';
import type { SocialLink, ContactNumber } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
};

const footerLinks = {
  marketplace: [
    { name: 'شاحنات', path: '/vehicles' },
    { name: 'معدات ثقيلة', path: '/equipment' },
    { name: 'حمولات', path: '/loads' },
    { name: 'وظائف', path: '/jobs' },
    { name: 'القطع الغيار', path: '/spare-parts' },
  ],
  services: [
    { name: 'التمويل', path: '/finance' },
    { name: 'الخدمات', path: '/services' },
    { name: 'طوارئ', path: '/emergency' },
    { name: 'المحللات', path: '#' },
    { name: 'المؤسسات', path: '#' },
  ],
  company: [
    { name: 'عن طريق', path: '#' },
    { name: 'اتصل بنا', path: '/contact' },
    { name: 'شروط الاستخدام', path: '#' },
    { name: 'سياسة الخصوصية', path: '#' },
    { name: 'الأسئلة الشائعة', path: '#' },
  ],
};

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactNumbers, setContactNumbers] = useState<ContactNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialRes, contactRes] = await Promise.all([
          socialLinksApi.getAll(),
          contactNumbersApi.getAll(),
        ]);
        setSocialLinks(socialRes.data.data);
        setContactNumbers(contactRes.data.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSocialIcon = (iconName?: string) => {
    const Icon = iconMap[iconName || ''] || MessageCircle;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <footer className="bg-navy text-white pt-12 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/tareeq-logo.png" alt="طريق" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl leading-none">طريق</span>
                <span className="text-orange text-sm font-semibold leading-none">TAREEQ</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              أكبر سوق إلكتروني لنقل الثقيل في مصر. نربط أصحاب الشاحنات والشركات النقل وأصحاب الحمولات في مكان واحد.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-orange flex items-center justify-center transition-colors"
                    title={link.name}
                    style={{ color: link.color || 'white' }}
                  >
                    {renderSocialIcon(link.icon)}
                  </a>
                ))
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">السوق</h4>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">الخدمات</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              {loading ? (
                <li className="text-gray-400 text-sm">جاري التحميل...</li>
              ) : contactNumbers.length > 0 ? (
                contactNumbers.slice(0, 4).map((contact) => (
                  <li key={contact.id}>
                    <a
                      href={getPhoneLink(contact.phone)}
                      className="flex items-center gap-2 text-gray-400 hover:text-orange text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4 text-orange" />
                      <span>{contact.title}: {contact.phone}</span>
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone className="w-4 h-4 text-orange" />
                    <span>0100 123 4567</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4 text-orange" />
                    <span>info@tareeq.com</span>
                  </li>
                </>
              )}
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-orange" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2024 طريق TAREEQ. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Truck className="w-4 h-4 text-orange" />
            <span>أكبر سوق لنقل الثقيل في مصر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
