import { supabase } from "../lib/supabase"
export type Interest = { id: string; student_id: string; category: string | null; tag: string }

export async function listInterests(studentId: string) {
  const { data, error } = await supabase.from("interests").select("*").eq("student_id", studentId)
  if (error) throw error
  return data as Interest[]
}
export async function createInterest(payload: Omit<Interest,"id">) {
  const { data, error } = await supabase.from("interests").insert(payload).select().single()
  if (error) throw error
  return data as Interest
}
export async function deleteInterest(id: string) {
  const { error } = await supabase.from("interests").delete().eq("id", id)
  if (error) throw error
  return true
}
