import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, X, Phone, Loader2 } from 'lucide-react';
import { contactNumbersApi } from '../../lib/api';
import type { ContactNumber } from '../../types';

const departmentOptions = [
  { value: 'support', label: 'الدعم الفني' },
  { value: 'sales', label: 'المبيعات' },
  { value: 'finance', label: 'التمويل' },
  { value: 'emergency', label: 'طوارئ' },
  { value: 'management', label: 'الادارة' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'other', label: 'أخرى' },
];

export default function ContactNumbersManager() {
  const [numbers, setNumbers] = useState<ContactNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ContactNumber>>({
    title: '',
    phone: '',
    department: 'support',
    description: '',
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const response = await contactNumbersApi.getAll(false);
      setNumbers(response.data.data);
    } catch (error) {
      console.error('Error fetching contact numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await contactNumbersApi.update(editingId, formData);
      } else {
        await contactNumbersApi.create(formData);
      }
      setEditingId(null);
      setFormData({ title: '', phone: '', department: 'support', description: '', isActive: true, displayOrder: numbers.length });
      fetchNumbers();
    } catch (error) {
      console.error('Error saving contact number:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (number: ContactNumber) => {
    setEditingId(number.id);
    setFormData({ ...number });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرقم؟')) return;
    try {
      await contactNumbersApi.delete(id);
      fetchNumbers();
    } catch (error) {
      console.error('Error deleting contact number:', error);
    }
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
          {editingId ? 'تعديل رقم تواصل' : 'إضافة رقم تواصل'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">العنوان *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
              placeholder="مثال: خط الدعم"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">رقم الهاتف *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
              placeholder="01xxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">القسم</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
            >
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-light mb-1.5">الوصف</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-10 px-3 bg-white rounded-lg border border-border focus:border-orange focus:outline-none text-sm"
              placeholder="مثال: متواجد 24/7"
            />
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
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-6 bg-orange hover:bg-orange-dark disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editingId ? 'حفظ' : 'إضافة'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', phone: '', department: 'support', description: '', isActive: true, displayOrder: numbers.length });
                }}
                className="h-10 px-3 bg-gray-200 hover:bg-gray-300 text-text rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Numbers List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg">
              <tr>
                <th className="px-4 py-3 text-right font-bold text-text">العنوان</th>
                <th className="px-4 py-3 text-right font-bold text-text">القسم</th>
                <th className="px-4 py-3 text-right font-bold text-text">الرقم</th>
                <th className="px-4 py-3 text-right font-bold text-text">الحالة</th>
                <th className="px-4 py-3 text-right font-bold text-text">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {numbers.sort((a, b) => a.displayOrder - b.displayOrder).map((number) => (
                <tr key={number.id} className="hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-orange" />
                      </div>
                      <div>
                        <p className="font-bold text-text">{number.title}</p>
                        {number.description && <p className="text-xs text-text-light">{number.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-bg">
                      {departmentOptions.find(d => d.value === number.department)?.label || number.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-navy">{number.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${number.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {number.isActive ? 'فعال' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(number)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="تعديل"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(number.id)}
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
        {numbers.length === 0 && (
          <div className="p-8 text-center text-text-light text-sm">
            لا توجد أرقام تواصل مضافة. ابدأ بإضافة رقم جديد.
          </div>
        )}
      </div>
    </div>
  );
}
