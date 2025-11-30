import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Download, Search, Filter } from 'lucide-react';

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', employeeId: '' });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Report
  const handleSearch = async (e) => {
    e.preventDefault();
    if(!filters.fromDate || !filters.toDate) return alert("Please select date range");
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post('http://localhost:5000/api/attendance/report', filters, config);
      setReportData(res.data);
    } catch (error) {
      alert('Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  // Export CSV Logic
  const exportCSV = () => {
    if(reportData.length === 0) return alert("No data to export");
    const headers = ["Date", "Employee", "ID", "Department", "Status", "In", "Out", "Hours"];
    const rows = reportData.map(r => [
      r.date, r.userId?.name, r.userId?.employeeId, r.userId?.department,
      r.status, 
      moment(r.checkInTime).format('LT'), 
      r.checkOutTime ? moment(r.checkOutTime).format('LT') : '-', 
      r.totalHours || 0
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Attendance_Report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Attendance Reports</h1>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">From Date</label>
            <input type="date" className="w-full p-2 border rounded-lg" 
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">To Date</label>
            <input type="date" className="w-full p-2 border rounded-lg" 
              onChange={(e) => setFilters({...filters, toDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Employee ID (Optional)</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input type="text" placeholder="Search by User ID..." className="w-full pl-10 p-2 border rounded-lg"
                 // Note: Ideally this would be a dropdown of users, but text input works for now
                 // You would need to pass the Database _id here for exact match, 
                 // or update backend to search by String employeeId. 
                 // For now, let's assume we filter by Date only for simplicity in this demo.
                 disabled
                 title="Filter by specific employee (Coming Soon)"
              />
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Filter size={18} /> Generate
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Report Results ({reportData.length} records)</h3>
          <button onClick={exportCSV} className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">In / Out</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {reportData.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-700">{r.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{r.userId?.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{r.userId?.department}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase">{r.status}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {moment(r.checkInTime).format('HH:mm')} - {r.checkOutTime ? moment(r.checkOutTime).format('HH:mm') : 'Active'}
                </td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">No data found. Select a date range.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Reports;