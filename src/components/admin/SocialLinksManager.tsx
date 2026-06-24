import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, X, Facebook, Twitter, Instagram, Linkedin, Youtube, Music2, MessageCircle, Ghost, Loader2 } from 'lucide-react';
import { socialLinksApi } from '../../lib/api';
import type { SocialLink } from '../../types';

const platformOptions = [
  { platform: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { platform: 'twitter', name: 'Twitter', icon: 'Twitter', color: '#1DA1F2' },
  { platform: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { platform: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { platform: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { platform: 'tiktok', name: 'TikTok', icon: 'Music2', color: '#000000' },
  { platform: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', color: '#25D366' },
  { platform: 'telegram', name: 'Telegram', icon: 'Send', color: '#0088CC' },
  { platform: 'snapchat', name: 'Snapchat', icon: 'Ghost', color: '#FFFC00' },
];

const iconMap: Record<string, React.ElementType> = {
  Facebook, Twitter, Instagram, Linkedin, Youtube, Music2, MessageCircle, Ghost,
};

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: 'facebook',
    name: '',
    url: '',
    icon: 'Facebook',
    color: '#1877F2',
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await socialLinksApi.getAll(false);
      setLinks(response.data.data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await socialLinksApi.update(editingId, formData);
      } else {
        await socialLinksApi.create(formData);
      }
      setEditingId(null);
      setFormData({ platform: 'facebook', name: '', url: '', icon: 'Facebook', color: '#1877F2', isActive: true, displayOrder: links.length });
      fetchLinks();
    } catch (error) {
      console.error('Error saving social link:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setFormData({ ...link });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return;
    try {
      await socialLinksApi.delete(id);
      fetchLinks();
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  const handlePlatformChange = (platform: string) => {
    const option = platformOptions.find(p => p.platform === platform);
    setFormData({
      ...formData,
      platform,
      icon: option?.icon || 'MessageCircle',
      color: option?.color || '#0D1B2A',
      name: formData.name || option?.name || '',
    });
  };

  const renderIcon = (iconName?: string) => {
    const Icon = iconMap[iconName || ''] || MessageCircle;
    return <Icon className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-bg rounded-2xl p-5">
        <h3 className="font-bold text-navy mb-4">
          {editingId ? 'تعديل رابط تواصل' : 'إضافة رابط تواصل'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">المنصة</label>
            <select
              value={formData.platform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
            >
              {platformOptions.map((option) => (
                <option key={option.platform} value={option.platform}>{option.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">الاسم المرئي</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-light mb-1.5">الرابط</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">اللون</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">الترتيب</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border text-orange focus:ring-orange"
              />
              فعال
            </label>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 bg-orange hover:bg-orange-dark disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editingId ? 'حفظ' : 'إضافة'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ platform: 'facebook', name: '', url: '', icon: 'Facebook', color: '#1877F2', isActive: true, displayOrder: links.length });
                }}
                className="h-10 px-3 bg-gray-200 hover:bg-gray-300 text-text rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg">
              <tr>
                <th className="px-4 py-3 text-right font-bold text-text">المنصة</th>
                <th className="px-4 py-3 text-right font-bold text-text">الاسم</th>
                <th className="px-4 py-3 text-right font-bold text-text">الرابط</th>
                <th className="px-4 py-3 text-right font-bold text-text">الحالة</th>
                <th className="px-4 py-3 text-right font-bold text-text">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.sort((a, b) => a.displayOrder - b.displayOrder).map((link) => (
                <tr key={link.id} className="hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${link.color}15`, color: link.color }}
                      >
                        {renderIcon(link.icon)}
                      </div>
                      <span className="font-bold text-text">{link.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{link.name}</td>
                  <td className="px-4 py-3">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-orange hover:underline line-clamp-1 max-w-[200px]">
                      {link.url}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${link.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {link.isActive ? 'فعال' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(link)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="تعديل"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {links.length === 0 && (
          <div className="p-8 text-center text-text-light text-sm">
            لا توجد روابط تواصل مضافة. ابدأ بإضافة رابط جديد.
          </div>
        )}
      </div>
    </div>
  );
}
