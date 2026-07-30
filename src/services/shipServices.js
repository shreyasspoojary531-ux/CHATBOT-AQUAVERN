import { supabase } from "../utils/supabase";

/**
 * Create a new ship service listing.
 * @param {{ ship_name: string, current_location: string, services_offered: string[] }} data
 */
export async function createShipService(data) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: result, error } = await supabase
    .from("ship_services")
    .insert({
      user_id: user.id,
      ship_name: data.ship_name,
      current_location: data.current_location,
      services_offered: data.services_offered,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Fetch all active ship service listings.
 */
export async function getAllShipServices() {
  const { data, error } = await supabase
    .from("ship_services")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Delete a ship service listing (owner only).
 * @param {string} id
 */
export async function deleteShipService(id) {
  const { error } = await supabase
    .from("ship_services")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Create a service request (order) from current user to a ship.
 * @param {{ to_ship_service_id: string, services_requested: string[], message: string }} data
 */
export async function requestService(data) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: result, error } = await supabase
    .from("service_requests")
    .insert({
      from_user_id: user.id,
      to_ship_service_id: data.to_ship_service_id,
      services_requested: data.services_requested,
      message: data.message,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}
