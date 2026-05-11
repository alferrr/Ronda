import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useReports from "../../controllers/useReports";
import useAuth from "../../controllers/useAuth";
import "./ResidentDashboard.css";

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

const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const { reports, loading, fetchMyReports, fetchAllReports } = useReports();
  const [tab, setTab] = useState("community");
  const [search, setSearch] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === "community") {
      fetchAllReports();
    } else {
      fetchMyReports();
    }
  }, [tab]);

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

  const filtered = reports.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.incident_type.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.address && r.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="resident-dash">
      <header className={`dash-header${headerVisible ? "" : " hidden"}`}>
        <h1>Ronda</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Sign out
        </button>
        <div className="dash-header__left">
          <p>Good Day, {user?.full_name?.split(" ")[0] || "Resident"}</p>
          <input
            type="text"
            placeholder="Search Alerts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="dash-body">
        <div className="dash-cta">
          <div>
            <h2>See something?</h2>
            <p>Report it immediately and let the barangay respond.</p>
          </div>
          <button
            className="btn-report"
            onClick={() => navigate("/report/new")}
          >
            New Report
          </button>
        </div>

        <div className="dash-tabs">
          <button
            className={`tab-btn ${tab === "community" ? "active" : ""}`}
            onClick={() => setTab("community")}
          >
            Community Feed
          </button>
          <button
            className={`tab-btn ${tab === "mine" ? "active" : ""}`}
            onClick={() => setTab("mine")}
          >
            My Reports
          </button>
        </div>

        <section className="dash-reports">
          {loading && <p className="dash-hint">Loading...</p>}
          {!loading && filtered.length === 0 && (
            <p className="dash-hint">
              {search
                ? "No reports match your search."
                : tab === "community"
                  ? "No community reports yet."
                  : "You haven't submitted any reports yet."}
            </p>
          )}
          <div className="report-list">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                showAuthor={tab === "community"}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ReportCard = ({ report, showAuthor, currentUserId }) => {
  const meta = STATUS_META[report.status] || STATUS_META.pending;
  const isOwn = report.resident_id === currentUserId;
  const label = INCIDENT_LABELS[report.incident_type] || report.incident_type;

  return (
    <div className="report-card">
      {report.photo_url && (
        <img
          src={report.photo_url}
          alt="Report"
          className="report-card__photo"
        />
      )}
      <div className="report-card__top">
        <span className="report-card__type">{label}</span>
        <span className="report-card__status" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
      <p className="report-card__desc">{report.description}</p>
      {report.address && <p className="report-card__addr">{report.address}</p>}
      <div className="report-card__footer">
        {showAuthor && (
          <span className="report-card__author">
            {isOwn ? "You" : report.profiles?.full_name || "Anonymous"}
          </span>
        )}
        <span className="report-card__date">
          {new Date(report.created_at).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ResidentDashboard;
