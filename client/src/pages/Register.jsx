import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', department: 'IT', employeeId: ''
  });
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      alert('Registration Successful! Please Login.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE - INFO */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10">
           <h1 className="text-4xl font-bold text-white mb-6">Join the team</h1>
           <div className="space-y-6">
             <div className="flex items-start gap-4">
               <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 mt-1"><CheckCircle size={20} /></div>
               <div>
                 <h3 className="text-white font-bold text-lg">Real-time Tracking</h3>
                 <p className="text-slate-400">Mark your attendance instantly from any device.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-1"><CheckCircle size={20} /></div>
               <div>
                 <h3 className="text-white font-bold text-lg">Performance Analytics</h3>
                 <p className="text-slate-400">View your work hours and history in beautiful charts.</p>
               </div>
             </div>
           </div>
        </div>
        <div className="relative z-10 text-slate-500 text-sm">
          © 2025 WorkTrackPro Inc.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-slate-100 my-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Employee Account</h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input type="text" name="name" onChange={onChange} className="w-full pl-9 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Employee ID</label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input type="text" name="employeeId" onChange={onChange} className="w-full pl-9 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input type="email" name="email" onChange={onChange} className="w-full pl-9 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
              <select name="department" onChange={onChange} className="w-full mt-1 p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="IT">IT Department</option>
                <option value="HR">HR Department</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input type="password" name="password" onChange={onChange} className="w-full pl-9 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg mt-4 flex items-center justify-center gap-2">
              Get Started <ChevronRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;