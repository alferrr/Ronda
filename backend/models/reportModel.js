const supabase = require("../db/supabaseClient");

const ReportModel = {
  async create({
    residentId,
    incidentType,
    description,
    photoUrl,
    latitude,
    longitude,
    address,
  }) {
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          resident_id: residentId,
          incident_type: incidentType,
          description,
          photo_url: photoUrl || null,
          latitude: latitude || null,
          longitude: longitude || null,
          address: address || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll({ status, incidentType, limit = 50, offset = 0 } = {}) {
    let query = supabase
      .from("reports")
      .select(
        `
        *,
        profiles:resident_id (full_name, phone, barangay)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (incidentType) query = query.eq("incident_type", incidentType);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findByResident(residentId) {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("resident_id", residentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        *,
        profiles:resident_id (full_name, phone, barangay)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id, { status, officialNotes, assignedTo }) {
    const updates = { status };
    if (officialNotes !== undefined) updates.official_notes = officialNotes;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from("reports")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadPhoto(file, filename) {
    const { data, error } = await supabase.storage
      .from("report-photos")
      .upload(`reports/${filename}`, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("report-photos")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};

module.exports = ReportModel;
