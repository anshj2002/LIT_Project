import { supabase } from "../lib/supabase"
export type Endorsement = {
  id: string; student_id: string; reviewer_name: string; reviewer_title: string | null;
  reviewer_avatar_url: string | null; rating: number; comment: string | null;
}

export async function listEndorsements(studentId: string) {
  const { data, error } = await supabase.from("endorsements").select("*").eq("student_id", studentId).order("created_at", { ascending: false })
  if (error) throw error
  return data as Endorsement[]
}
export async function createEndorsement(payload: Omit<Endorsement,"id">) {
  const { data, error } = await supabase.from("endorsements").insert(payload).select().single()
  if (error) throw error
  return data as Endorsement
}
export async function updateEndorsement(id: string, patch: Partial<Endorsement>) {
  const { data, error } = await supabase.from("endorsements").update(patch).eq("id", id).select().single()
  if (error) throw error
  return data as Endorsement
}
export async function deleteEndorsement(id: string) {
  const { error } = await supabase.from("endorsements").delete().eq("id", id)
  if (error) throw error
  return true
}
