const ReportModel = require("../models/reportModel");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ReportController = {
  upload: upload.single("photo"),

  async createReport(req, res) {
    const { incidentType, description, latitude, longitude, address } =
      req.body;

    if (!incidentType || !description) {
      return res
        .status(400)
        .json({ error: "incidentType and description are required." });
    }

    try {
      let photoUrl = null;

      if (req.file) {
        const filename = `${Date.now()}-${req.file.originalname}`;
        photoUrl = await ReportModel.uploadPhoto(req.file.buffer, filename);
      }

      const report = await ReportModel.create({
        residentId: req.user.id,
        incidentType,
        description,
        photoUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        address,
      });

      return res.status(201).json({ message: "Report submitted.", report });
    } catch (err) {
      console.error("Create report error:", err);
      return res
        .status(500)
        .json({ error: err.message || "Failed to submit report." });
    }
  },

  async getAllReports(req, res) {
    const { status, incidentType, limit, offset } = req.query;

    try {
      const reports = await ReportModel.findAll({
        status,
        incidentType,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });

      return res.status(200).json({ reports });
    } catch (err) {
      console.error("Get all reports error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  async getMyReports(req, res) {
    try {
      const reports = await ReportModel.findByResident(req.user.id);
      return res.status(200).json({ reports });
    } catch (err) {
      console.error("Get my reports error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  async getReportById(req, res) {
    try {
      const report = await ReportModel.findById(req.params.id);
      return res.status(200).json({ report });
    } catch (err) {
      return res.status(404).json({ error: "Report not found." });
    }
  },

  async updateStatus(req, res) {
    const { status, officialNotes, assignedTo } = req.body;

    const validStatuses = ["pending", "in_progress", "resolved"];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${validStatuses.join(", ")}.` });
    }

    try {
      const report = await ReportModel.updateStatus(req.params.id, {
        status,
        officialNotes,
        assignedTo,
      });

      return res.status(200).json({ message: "Report updated.", report });
    } catch (err) {
      console.error("Update status error:", err);
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ReportController;
