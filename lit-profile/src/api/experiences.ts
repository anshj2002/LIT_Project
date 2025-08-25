import { supabase } from "../lib/supabase"

export type Experience = {
  id: string
  student_id: string
  company: string
  role: string
  start_date: string
  end_date: string | null
  description: string | null
  logo_url: string | null
  sort_order: number | null
}

export async function listExperiences(studentId: string): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("student_id", studentId)
    .order("sort_order", { ascending: true })
  if (error) throw error
  return data as Experience[]
}

export async function createExperience(payload: Omit<Experience, "id">) {
  const { data, error } = await supabase.from("experiences").insert(payload).select().single()
  if (error) throw error
  return data as Experience
}

export async function updateExperience(id: string, patch: Partial<Experience>) {
  const { data, error } = await supabase.from("experiences").update(patch).eq("id", id).select().single()
  if (error) throw error
  return data as Experience
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from("experiences").delete().eq("id", id)
  if (error) throw error
  return true
}
