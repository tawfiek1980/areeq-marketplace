import { useState } from "react";
import ProfileForm from "../components/profile/ProfileForm";

export default function CompleteProfile() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">
            استكمال بيانات الحساب
          </h1>

          <p className="mt-2 opacity-90">
            أكمل بياناتك مرة واحدة للاستفادة من جميع خدمات طريق.
          </p>
        </div>

        <div className="p-6">
          <ProfileForm
            saving={saving}
            setSaving={setSaving}
          />
        </div>

      </div>
    </div>
  );
}