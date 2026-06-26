import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { completeProfile } from "../../lib/userService";
import type { User } from "../../types";

interface Props {
  saving: boolean;
  setSaving: (value: boolean) => void;
}

const accountTypes: { value: User["type"]; label: string }[] = [
  { value: "individual", label: "فرد" },
  { value: "dealer", label: "معرض سيارات" },
  { value: "company", label: "شركة نقل" },
  { value: "workshop", label: "ورشة" },
  { value: "finance", label: "شركة تمويل" },
];

const governorates = [
  "القاهرة",
  "الجيزة",
  "القليوبية",
  "الإسكندرية",
  "البحيرة",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
];

export default function ProfileForm({
  saving,
  setSaving,
}: Props) {
  const navigate = useNavigate();

  const { user, login } = useAuth();

  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [governorate, setGovernorate] = useState(user.governorate);

  const [type, setType] = useState<User["type"]>(user.type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone || !governorate) {
      alert("يرجى استكمال جميع البيانات");
      return;
    }

    try {
      setSaving(true);

      await completeProfile(user!.id, {
        name,
        phone,
        governorate,
        type,
      });

      const updatedUser: User = {
  ...user!,
        ...user,
        name,
        phone,
        governorate,
        type,
      };

      login(updatedUser);

      alert("تم حفظ البيانات");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block mb-2">الاسم</label>

        <input
          className="w-full border rounded-xl p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2">رقم الهاتف</label>

        <input
          className="w-full border rounded-xl p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2">المحافظة</label>

        <select
          className="w-full border rounded-xl p-3"
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
        >
          <option value="">اختر المحافظة</option>

          {governorates.map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">نوع الحساب</label>

        <select
          className="w-full border rounded-xl p-3"
          value={type}
          onChange={(e) =>
            setType(e.target.value as User["type"])
          }
        >
          {accountTypes.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={saving}
        className="w-full bg-blue-600 text-white rounded-xl py-3"
      >
        {saving ? "جارى الحفظ..." : "حفظ البيانات"}
      </button>

    </form>
  );
}