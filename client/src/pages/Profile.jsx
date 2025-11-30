import { useSelector } from 'react-redux';
import { Mail, Briefcase, Hash, Calendar, Shield, User } from 'lucide-react';
import moment from 'moment';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 px-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Cover Photo Area */}
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Header (Avatar overlaps cover) */}
        <div className="px-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-6">
             <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center">
                   <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-5xl font-bold text-indigo-600">
                     {user.name?.charAt(0)}
                   </div>
                </div>
                <div className="mb-4">
                   <h1 className="text-3xl font-extrabold text-slate-800">{user.name}</h1>
                   <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Mail size={16}/> {user.email}
                   </div>
                </div>
             </div>
             
             <div className="mb-4">
                <span className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide border border-indigo-100 shadow-sm">
                  {user.role}
                </span>
             </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-10 mb-8"></div>

        {/* Details Grid */}
        <div className="px-10 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <InfoCard icon={Briefcase} color="text-blue-600" bg="bg-blue-50" label="Department" value={user.department} />
           <InfoCard icon={Hash} color="text-purple-600" bg="bg-purple-50" label="Employee ID" value={user.employeeId} />
           <InfoCard icon={Calendar} color="text-emerald-600" bg="bg-emerald-50" label="Joined Date" value={moment(user.createdAt).format('LL')} />
           <InfoCard icon={Shield} color="text-orange-600" bg="bg-orange-50" label="System Role" value={user.role} />
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistency
const InfoCard = ({ icon: Icon, color, bg, label, value }) => (
  <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 bg-slate-50/50 hover:bg-white">
     <div className={`p-3.5 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
     </div>
     <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-800 capitalize">{value || 'N/A'}</p>
     </div>
  </div>
);

export default Profile;