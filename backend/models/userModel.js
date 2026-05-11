const supabase = require("../db/supabaseClient");

const UserModel = {
  async createProfile({ id, fullName, role, barangay, phone }) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id,
          full_name: fullName,
          role,
          barangay: barangay || null,
          phone: phone || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async findAllOfficials() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, barangay")
      .eq("role", "official");

    if (error) throw error;
    return data;
  },
};

module.exports = UserModel;
