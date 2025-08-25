import { supabase } from "../lib/supabase"
export type Competition = {
  id: string; student_id: string; name: string; org: string | null; role: string | null;
  start_date: string | null; end_date: string | null; achievement: string | null; description: string | null;
  badge_url: string | null; sort_order: number | null;
}

export async function listCompetitions(studentId: string) {
  const { data, error } = await supabase.from("competitions").select("*").eq("student_id", studentId).order("sort_order", { ascending: true })
  if (error) throw error
  return data as Competition[]
}
export async function createCompetition(payload: Omit<Competition,"id">) {
  const { data, error } = await supabase.from("competitions").insert(payload).select().single()
  if (error) throw error
  return data as Competition
}
export async function updateCompetition(id: string, patch: Partial<Competition>) {
  const { data, error } = await supabase.from("competitions").update(patch).eq("id", id).select().single()
  if (error) throw error
  return data as Competition
}
export async function deleteCompetition(id: string) {
  const { error } = await supabase.from("competitions").delete().eq("id", id)
  if (error) throw error
  return true
}
