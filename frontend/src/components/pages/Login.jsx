import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FiEye, FiEyeOff, FiUser, FiLock, FiCheckCircle } from 'react-icons/fi';
import * as Yup from 'yup';

export default function Login() {
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/login',
        { ...values, isAdmin: isAdminLogin },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!res.data.token) throw new Error('No token received from server');
      localStorage.setItem('token', res.data.token);

      let hasProfile = false;
      try {
        const profileRes = await axios.get(
          'http://localhost:8000/api/profile/me',
          {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          }
        );
        hasProfile = !!profileRes.data?._id;
      } catch (err) {
        if (err.response?.status !== 404) throw err;
      }

      if (isAdminLogin) navigate('/admin');
      else if (hasProfile) navigate('/profile');
      else navigate('/create-profile');

    } catch (error) {
      console.error('Login error:', error);
      setStatus('Login failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-backgroundLight flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <FiCheckCircle className="text-highlight" /> Login to <span className="text-accent">DevConnect</span>
        </h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FiUser />
                  </span>
                  <Field
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <ErrorMessage name="email" component="p" className="text-error text-sm mt-1" />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FiLock />
                  </span>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <Link
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </Link>
                </div>
                <ErrorMessage name="password" component="p" className="text-error text-sm mt-1" />
              </div>

              {/* Admin Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="adminToggle"
                  checked={isAdminLogin}
                  onChange={() => setIsAdminLogin(!isAdminLogin)}
                  className="w-4 h-4 text-primary focus:ring-0 border-gray-300 rounded"
                />
                <label htmlFor="adminToggle" className="text-sm text-gray-800">
                  Login as Admin
                </label>
              </div>

              {/* Error Status */}
              {status && <p className="text-error text-center text-sm">{status}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-highlight transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-highlight font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
