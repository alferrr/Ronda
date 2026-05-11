// OfficialDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useReports from "../../controllers/useReports";
import useAuth from "../../controllers/useAuth";
import "./OfficialDashboard.css";

const STATUSES = ["all", "pending", "in_progress", "resolved"];
const STATUS_META = {
  pending: { label: "Pending", color: "#f59e0b" },
  in_progress: { label: "In Progress", color: "#3b82f6" },
  resolved: { label: "Resolved", color: "#22c55e" },
};
const INCIDENT_LABELS = {
  fire: "Fire",
  medical: "Medical",
  crime: "Crime",
  flood: "Flood",
  accident: "Accident",
  disturbance: "Disturbance",
  infrastructure: "Infrastructure",
  other: "Other",
};

const OfficialDashboard = () => {
  const { user, logout } = useAuth();
  const { reports, loading, fetchAllReports, updateStatus } = useReports();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllReports(filterStatus !== "all" ? { status: filterStatus } : {});
  }, [filterStatus, fetchAllReports]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    in_progress: reports.filter((r) => r.status === "in_progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="official-dash">
      <header className={`official-header${headerVisible ? "" : " hidden"}`}>
        <h1>Ronda</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Sign out
        </button>
        <div className="official-header__left">
          <p>Good Day, {user?.full_name?.split(" ")[0] || "Official"}</p>
          <span className="official-header__sub">Official Dashboard</span>
        </div>
      </header>

      <div className="official-body">
        <div className="stats-row">
          {[
            { label: "Total", value: stats.total, color: "#1a1a1a" },
            { label: "Pending", value: stats.pending, color: "#f59e0b" },
            {
              label: "In Progress",
              value: stats.in_progress,
              color: "#3b82f6",
            },
            { label: "Resolved", value: stats.resolved, color: "#22c55e" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="filter-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-btn${filterStatus === s ? " active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading && <p className="dash-hint">Loading reports...</p>}

        <div className="report-grid">
          {reports.map((r) => (
            <OfficialReportCard
              key={r.id}
              report={r}
              onSelect={() => setSelectedReport(r)}
            />
          ))}
          {!loading && reports.length === 0 && (
            <p className="dash-hint">No reports found.</p>
          )}
        </div>
      </div>

      {selectedReport && (
        <StatusModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={async (id, payload) => {
            await updateStatus(id, payload);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
};

const OfficialReportCard = ({ report, onSelect }) => {
  const meta = STATUS_META[report.status] || STATUS_META.pending;
  const label = INCIDENT_LABELS[report.incident_type] || report.incident_type;

  return (
    <div className="official-card" onClick={onSelect}>
      {report.photo_url ? (
        <img
          src={report.photo_url}
          alt="Report"
          className="official-card__photo"
        />
      ) : (
        <div className="official-card__no-photo">No photo available</div>
      )}
      {/* rest stays exactly the same */}
      <div className="official-card__top">
        <span className="official-card__type">{label}</span>
        <span className="official-card__status" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
      <p className="official-card__desc">{report.description}</p>
      <div className="official-card__meta">
        {report.profiles?.full_name && (
          <span className="official-card__reporter">
            {report.profiles.full_name}
          </span>
        )}
        {report.address && (
          <span className="official-card__addr">{report.address}</span>
        )}
        <span className="official-card__date">
          {new Date(report.created_at).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <button className="btn-update">Update Status</button>
    </div>
  );
};

const StatusModal = ({ report, onClose, onUpdate }) => {
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.official_notes || "");
  const [saving, setSaving] = useState(false);
  const label = INCIDENT_LABELS[report.incident_type] || report.incident_type;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(report.id, { status, officialNotes: notes });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <span className="modal__type">{label}</span>
            <h3>Update Report</h3>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            &#x2715;
          </button>
        </div>

        {report.photo_url && (
          <img src={report.photo_url} alt="Report" className="modal__photo" />
        )}

        <p className="modal__desc">{report.description}</p>

        {report.address && <p className="modal__addr">{report.address}</p>}

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="form-group">
          <label>Official Notes (optional)</label>
          <textarea
            rows={3}
            placeholder="Add notes for the resident..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default OfficialDashboard;
