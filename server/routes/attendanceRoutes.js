const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyHistory, getTodayAll, getAttendanceReport } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/today-all', protect, admin, getTodayAll); // <--- UPDATED THIS
router.post('/report', protect, admin, getAttendanceReport);

module.exports = router;