import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/authSlice';
import { Lock, Mail, ArrowRight, LayoutDashboard } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) alert(message);
    if (user) navigate('/dashboard');
    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => { e.preventDefault(); dispatch(login({ email, password })); };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 opacity-90"></div>
        <div className="relative z-10 text-white px-12 text-center">
          <LayoutDashboard size={64} className="mx-auto mb-6 text-indigo-300" />
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">WorkTrack<span className="text-indigo-300">Pro</span></h1>
          <p className="text-lg text-indigo-100 max-w-md mx-auto leading-relaxed">
            Streamline your workforce management with intelligent attendance tracking and real-time analytics.
          </p>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full mix-blend-overlay blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full mix-blend-overlay blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  value={email} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  name="password" 
                  value={password} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline hover:text-indigo-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;