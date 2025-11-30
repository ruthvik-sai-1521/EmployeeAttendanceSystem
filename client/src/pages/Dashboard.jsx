import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyHistory, getTodayAll, checkIn, checkOut } from '../features/attendanceSlice';
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CheckCircle, XCircle, Clock, Search, AlertTriangle, User, Calendar as CalendarIcon, Briefcase } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { history, todayStatus } = useSelector((state) => state.attendance);
  
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'manager') {
        dispatch(getTodayAll());
      } else {
        dispatch(getMyHistory());
      }
    }
  }, [user, dispatch]);

  const filteredEmployees = todayStatus.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const managerStats = useMemo(() => {
    const total = todayStatus.length;
    const present = todayStatus.filter(e => e.status === 'present' || e.status === 'late').length;
    const absent = todayStatus.filter(e => e.status === 'Not Checked In').length;
    return { total, present, absent };
  }, [todayStatus]);

  const chartData = useMemo(() => {
    const depts = {};
    todayStatus.forEach(emp => {
      const d = emp.department || 'General';
      if(emp.status !== 'Not Checked In') depts[d] = (depts[d] || 0) + 1;
    });
    return {
      labels: Object.keys(depts),
      datasets: [{ label: 'Present Today', data: Object.values(depts), backgroundColor: '#6366f1', borderRadius: 5 }]
    };
  }, [todayStatus]);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dStr = moment(date).format('YYYY-MM-DD');
      const rec = history.find(r => r.date === dStr);
      if (rec?.status === 'present') return 'bg-emerald-100 text-emerald-800 font-bold rounded-lg';
      if (rec?.status === 'late') return 'bg-amber-100 text-amber-800 font-bold rounded-lg';
      if (rec?.status === 'absent') return 'bg-rose-100 text-rose-800 font-bold rounded-lg';
    }
    return null;
  };

  const getStatusBadge = (status) => {
    const map = {
      'present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'late': 'bg-amber-100 text-amber-700 border-amber-200',
      'absent': 'bg-rose-100 text-rose-700 border-rose-200',
      'Not Checked In': 'bg-slate-100 text-slate-500 border-slate-200'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border shadow-sm ${map[status] || map['Not Checked In']}`}>{status}</span>;
  };

  if (!user) return null;

  return (
    <div className="w-full p-6 md:p-10 bg-slate-50 min-h-screen">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <CalendarIcon size={18} className="text-indigo-500"/> 
            {moment().format('dddd, MMMM Do YYYY')}
          </p>
        </div>

        {user.role === 'employee' && (
          <div className="flex flex-col items-end gap-3">
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
               <Clock size={16} className="text-indigo-600 animate-pulse"/>
               <span className="text-sm font-semibold text-slate-600">Shift Starts: <span className="text-slate-900">10:00 AM</span></span>
             </div>
             <div className="flex gap-3">
               <button onClick={() => dispatch(checkIn())} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">Check In</button>
               <button onClick={() => dispatch(checkOut())} className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-500/30 transition-all transform hover:-translate-y-0.5">Check Out</button>
             </div>
          </div>
        )}
      </div>

      {/* --- MANAGER VIEW --- */}
      {user.role === 'manager' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Total Employees</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2 relative z-10">{managerStats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Present Today</p>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2 relative z-10">{managerStats.present}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Absent / Unknown</p>
              <p className="text-4xl font-extrabold text-rose-500 mt-2 relative z-10">{managerStats.absent}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <User size={20} className="text-indigo-600"/> Live Attendance Status
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                {emp.name.charAt(0)}
                             </div>
                             <div>
                               <div className="font-bold text-slate-700">{emp.name}</div>
                               <div className="text-xs text-slate-400 font-mono">{emp.employeeId}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{emp.department}</td>
                        <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                          {emp.checkInTime ? (
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500"/> {moment(emp.checkInTime).format('LT')}</span>
                          ) : <span className="text-slate-300">-</span>}
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">No employees found matching your search.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col">
              <h3 className="font-bold text-slate-700 mb-6">Department Distribution</h3>
              <div className="flex-grow flex items-center justify-center">
                 <Bar data={chartData} options={{ maintainAspectRatio: false }} height={300} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EMPLOYEE VIEW --- */}
      {user.role === 'employee' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-700">
           {/* Profile & Stats Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                 <div className="relative z-10 -mt-12">
                    <div className="w-24 h-24 bg-white p-1.5 rounded-full mx-auto shadow-md">
                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                          {user.name.charAt(0)}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mt-4">{user.name}</h2>
                    <p className="text-slate-500 text-sm flex items-center justify-center gap-1 mt-1"><Briefcase size={14}/> {user.department}</p>
                 </div>
                 
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Present</p>
                        <p className="text-2xl font-extrabold text-slate-700 mt-1">{history.filter(h=>h.status==='present').length}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Late</p>
                        <p className="text-2xl font-extrabold text-slate-700 mt-1">{history.filter(h=>h.status==='late').length}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Calendar */}
           <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Clock size={20}/></div>
                 <h3 className="text-xl font-bold text-slate-800">Attendance Calendar</h3>
              </div>
              <Calendar onChange={setDate} value={date} tileClassName={getTileClassName} className="w-full border-none"/>
              
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> On Time</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Late</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Absent</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;