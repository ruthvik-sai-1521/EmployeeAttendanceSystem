import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/authSlice';
import { LogOut, LayoutDashboard, User, FileText } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold tracking-wide text-indigo-400 hover:text-indigo-300 transition">
          <LayoutDashboard size={24} />
          <span>WorkTrack<span className="text-white">Pro</span></span>
        </Link>
        
        <div className="flex items-center gap-6">
          {!user ? (
            <div className="space-x-4">
              <Link to="/" className="text-sm font-medium hover:text-indigo-400 transition">Login</Link>
              <Link to="/register" className="text-sm bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md">Register</Link>
            </div>
          ) : (
            <>
               <div className="hidden md:block text-right">
                  {/* FIX: Ensure user.name is displayed safely */}
                  <p className="text-sm font-semibold text-white">{user.name || 'User'}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>

              {user.role === 'manager' && (
                <Link to="/reports" className="text-slate-300 hover:text-white flex items-center gap-1 transition" title="Reports">
                   <FileText size={20} /> <span className="hidden md:inline text-sm">Reports</span>
                </Link>
              )}
              
              <Link to="/profile" className="text-slate-300 hover:text-white transition" title="Profile">
                <User size={24} />
              </Link>

              <button onClick={onLogout} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-indigo-500/30">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;