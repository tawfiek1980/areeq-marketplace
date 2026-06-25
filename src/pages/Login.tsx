import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../lib/firebaseAuth";
import { auth } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setLoading(true);

      const user = await loginWithGoogle();

      auth.setUser(user);

      // 🔥 routing واضح بدون عك
      if (!user.phone || !user.governorate) {
        navigate("/complete-profile");
      } else if (user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert("فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGoogle} disabled={loading}>
        تسجيل دخول بجوجل
      </button>
    </div>
  );
}