import { supabase } from "../lib/supabase"

export type Student = {
  id: string
  full_name: string
  institution: string | null
  bio: string | null
  avatar_url: string | null
}

export async function getFirstStudent(): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertStudent(partial: Partial<Student> & { id?: string }) {
  // if id exists, update; else insert one row (single profile scenario)
  if (partial.id) {
    const { data, error } = await supabase
      .from("students")
      .update(partial)
      .eq("id", partial.id)
      .select()
      .single()
    if (error) throw error
    return data as Student
  } else {
    const { data, error } = await supabase
      .from("students")
      .insert(partial)
      .select()
      .single()
    if (error) throw error
    return data as Student
  }
}
