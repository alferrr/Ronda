const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

router.use(authenticate);

// Resident: submit a report
router.post(
  "/",
  requireRole("resident"),
  ReportController.upload,
  ReportController.createReport,
);

// Resident: view own reports
router.get("/my", requireRole("resident"), ReportController.getMyReports);

// All authenticated users: view all reports (community feed)
router.get("/", ReportController.getAllReports);

// Both: view a single report
router.get("/:id", ReportController.getReportById);

// Official: update report status
router.patch(
  "/:id/status",
  requireRole("official"),
  ReportController.updateStatus,
);

module.exports = router;
