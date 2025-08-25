import { supabase } from "../lib/supabase"

export type Skill = {
  id: string
  student_id: string
  name: string
  level: number
  endorsements_count: number
  category: string | null
  sort_order: number | null
}

export async function listSkills(studentId: string): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("student_id", studentId)
    .order("sort_order", { ascending: true })
  if (error) throw error
  return data as Skill[]
}

export async function createSkill(payload: Omit<Skill, "id">) {
  const { data, error } = await supabase
    .from("skills")
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as Skill
}

export async function updateSkill(id: string, patch: Partial<Skill>) {
  const { data, error } = await supabase
    .from("skills")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Skill
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) throw error
  return true
}
