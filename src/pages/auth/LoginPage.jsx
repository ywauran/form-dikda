import React, { useState } from "react";
import { app } from "../../config/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Track error
  const [loading, setLoading] = useState(false); // Track loading state
  const auth = getAuth(app);
  let navigate = useNavigate();

  const handlerLoginSubmit = (e) => {
    e.preventDefault();

    // Check if email and password are provided
    if (!email || !password) {
      setError("empty-fields");
      return;
    }

    setLoading(true); // Start loading

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/pages/home");
        sessionStorage.setItem(
          "Auth Token",
          userCredential._tokenResponse.refreshToken
        );
      })
      .catch((error) => {
        setError(error.code); // Set error code
        console.log(error.code);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  // Custom error messages
  const errorMessage = () => {
    switch (error) {
      case "auth/wrong-password":
        return "Kata sandi salah. Silakan coba lagi.";
      case "auth/user-not-found":
        return "Pengguna tidak ditemukan. Silakan daftar terlebih dahulu.";
      case "auth/invalid-email":
        return "Email tidak valid. Silakan periksa kembali.";
      case "empty-fields":
        return "Mohon lengkapi email dan kata sandi.";
      default:
        return "Terjadi kesalahan saat masuk. Silakan coba lagi.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-96">
        <h3 className="text-2xl font-bold text-center text-first">
          Halaman Masuk
        </h3>
        <form action="">
          <div className="">
            <div>
              <label htmlFor="email" className="label__input">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="label__input">
                Kata Sandi
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            {error && <div className="mt-4 text-red-500">{errorMessage()}</div>}
            <div className="mt-6">
              <button
                onClick={handlerLoginSubmit}
                className={`w-full button__primary ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Memuat..." : "Masuk"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
