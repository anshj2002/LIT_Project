import { supabase } from "../lib/supabase"
export type Feedback = {
  id: string; student_id: string; kind: "text"|"audio"|"video"; text_content: string | null; media_url: string | null;
}

export async function listFeedback(studentId: string) {
  const { data, error } = await supabase.from("feedback").select("*").eq("student_id", studentId).order("created_at", { ascending: false })
  if (error) throw error
  return data as Feedback[]
}
export async function createFeedback(payload: Omit<Feedback,"id">) {
  const { data, error } = await supabase.from("feedback").insert(payload).select().single()
  if (error) throw error
  return data as Feedback
}
export async function deleteFeedback(id: string) {
  const { error } = await supabase.from("feedback").delete().eq("id", id)
  if (error) throw error
  return true
}
