'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import {getUsers, Login} from './helper/api';

export default function Home() {
  const router = useRouter();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
});
  const validateForm = async () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Tài khoản không được để trống';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    const isFormValid = await validateForm();
    if (!isFormValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await Login(username, password);
      
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/dashboard");
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };
  // if (loading) {
  //   return <div>Loading...</div>
  // }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 custom-bg">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Đăng nhập</h2>
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tài khoản
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
                setErrors(prev => ({...prev, username: ''}));
              }}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({...prev, password: ''}));
              }}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
