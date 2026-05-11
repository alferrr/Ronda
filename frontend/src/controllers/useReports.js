import { useState, useCallback } from "react";
import reportService from "../services/reportService";

const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getMyReports();
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllReports = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getAllReports(filters);
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportService.submitReport(formData);
      return result.report;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportService.updateStatus(id, payload);
      setReports((prev) => prev.map((r) => (r.id === id ? result.report : r)));
      return result.report;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    fetchMyReports,
    fetchAllReports,
    submitReport,
    updateStatus,
  };
};

export default useReports;
