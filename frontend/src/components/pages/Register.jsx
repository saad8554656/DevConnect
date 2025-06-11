import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiKey, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const navigate = useNavigate();
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    role: Yup.string().required('Role is required'),
    adminSecret: Yup.string().when('role', {
      is: 'admin',
      then: Yup.string().required('Admin secret is required'),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('http://localhost:8000/api/auth/register', values);
      toast.success('Registration successful!', { autoClose: 2000 });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-backgroundLight flex items-center justify-center px-4">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <FiCheckCircle className="text-highlight" /> Create <span className="text-accent">DevConnect</span> account
        </h2>

        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'user', adminSecret: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FiUser />
                  </span>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <ErrorMessage name="name" component="p" className="text-error text-sm mt-1" />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FiMail />
                  </span>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <ErrorMessage name="email" component="p" className="text-error text-sm mt-1" />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-800 mb-1">Select Role</label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setFieldValue('role', selectedRole);
                    setShowAdminSecret(selectedRole === 'admin');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Field>
              </div>

              {/* Admin Secret */}
              {showAdminSecret && (
                <div>
                  <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-800 mb-1">Admin Secret</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <FiKey />
                    </span>
                    <Field
                      id="adminSecret"
                      name="adminSecret"
                      type="password"
                      placeholder="Enter admin secret"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                  <ErrorMessage name="adminSecret" component="p" className="text-error text-sm mt-1" />
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FiLock />
                  </span>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-highlight transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-highlight font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
