const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Import User model
const moment = require('moment');

// @desc    Check In
const checkIn = async (req, res) => {
  const userId = req.user._id;
  const today = moment().format('YYYY-MM-DD');

  const existingAttendance = await Attendance.findOne({ userId, date: today });
  if (existingAttendance) {
    return res.status(400).json({ message: 'Already checked in today' });
  }

  // LOGIC: Shift starts at 10:00 AM
  // We use moment() to get current time.
  const now = moment();
  const ruleTime = moment('10:00:00', 'HH:mm:ss'); 
  
  // If now is after 10:00 AM, status is 'late'
  const status = now.isAfter(ruleTime) ? 'late' : 'present';

  const attendance = await Attendance.create({
    userId,
    date: today,
    checkInTime: now.toDate(),
    status,
  });
  res.status(201).json(attendance);
};

// @desc    Check Out
const checkOut = async (req, res) => {
  const userId = req.user._id;
  const today = moment().format('YYYY-MM-DD');
  const attendance = await Attendance.findOne({ userId, date: today });

  if (!attendance) return res.status(400).json({ message: 'Not checked in' });

  attendance.checkOutTime = new Date();
  const start = moment(attendance.checkInTime);
  const end = moment(attendance.checkOutTime);
  attendance.totalHours = end.diff(start, 'hours', true).toFixed(2);

  await attendance.save();
  res.json(attendance);
};

// @desc    Get My History (Employee)
const getMyHistory = async (req, res) => {
  const history = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
  res.json(history);
};

// @desc    Get Today's Status for ALL Employees (Manager Dashboard)
// @route   GET /api/attendance/today-all
const getTodayAll = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    // 1. Get ALL Employees (exclude managers)
    const employees = await User.find({ role: 'employee' }).select('-password');

    // 2. Get ALL Attendance for Today
    const attendanceRecords = await Attendance.find({ date: today });

    // 3. Merge Data
    const result = employees.map(emp => {
      // Find if this employee has a record today
      const record = attendanceRecords.find(r => r.userId.toString() === emp._id.toString());
      
      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        employeeId: emp.employeeId,
        // If record exists, use its data. If not, set as 'Not Checked In'
        status: record ? record.status : 'Not Checked In',
        checkInTime: record ? record.checkInTime : null,
        checkOutTime: record ? record.checkOutTime : null,
        attendanceId: record ? record._id : null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Report (Reports Page)
const getAttendanceReport = async (req, res) => {
  const { fromDate, toDate } = req.body;
  try {
    const records = await Attendance.find({
      date: { $gte: fromDate, $lte: toDate }
    }).populate('userId', 'name email department employeeId').sort({ date: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
};

module.exports = { checkIn, checkOut, getMyHistory, getTodayAll, getAttendanceReport };