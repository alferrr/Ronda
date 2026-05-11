import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useReports from "../../controllers/useReports";
import "./ReportForm.css";

const INCIDENT_TYPES = [
  { value: "fire", label: "Fire" },
  { value: "medical", label: "Medical Emergency" },
  { value: "crime", label: "Crime / Threat" },
  { value: "flood", label: "Flood" },
  { value: "accident", label: "Accident" },
  { value: "disturbance", label: "Disturbance" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "other", label: "Other" },
];

const ReportForm = () => {
  const [form, setForm] = useState({
    incidentType: "",
    description: "",
    address: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [success, setSuccess] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const fileRef = useRef();
  const { submitReport, loading, error } = useReports();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReport({ ...form, photo, ...coords });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      // handled by hook
    }
  };

  if (success) {
    return (
      <div className="report-success">
        <div className="report-success__check" />
        <h2>Report submitted!</h2>
        <p>Barangay officials have been notified. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="report-form-page">
      <header className={`report-form-header${headerVisible ? "" : " hidden"}`}>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          Back
        </button>
        <h1>New Report</h1>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <p className="form-section-label">Incident Type</p>
          <div className="incident-grid">
            {INCIDENT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`incident-tile${form.incidentType === t.value ? " active" : ""}`}
                onClick={() =>
                  setForm((p) => ({ ...p, incidentType: t.value }))
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">What happened?</label>
          <textarea
            id="description"
            name="description"
            placeholder="Briefly describe the incident..."
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address / Landmark (optional)</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="e.g. Cor. Mango Ave and Jakosalem St"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <p className="form-section-label">Location</p>
          <button
            type="button"
            className={`btn-locate${coords ? " captured" : ""}`}
            onClick={getLocation}
            disabled={locating}
          >
            {locating
              ? "Getting location..."
              : coords
                ? "Location captured"
                : "Use my location"}
          </button>
          {coords && (
            <p className="coords-hint">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
        </div>

        <div className="form-section">
          <p className="form-section-label">Photo (optional)</p>
          <div className="photo-drop" onClick={() => fileRef.current.click()}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-drop__placeholder">
                <div className="photo-drop__icon" />
                <span>Tap to add a photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: "none" }}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="btn-submit"
          disabled={loading || !form.incidentType || !form.description}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
