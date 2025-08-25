import { useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabase"

export function useStudent() {
  return useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useSkills(studentId?: string) {
  return useQuery({
    queryKey: ["skills", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("student_id", studentId!)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useExperiences(studentId?: string) {
  return useQuery({
    queryKey: ["experiences", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("student_id", studentId!)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useInterests(studentId?: string) {
  return useQuery({
    queryKey: ["interests", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("*")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useEndorsements(studentId?: string) {
  return useQuery({
    queryKey: ["endorsements", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("endorsements")
        .select("*")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useCompetitions(studentId?: string) {
  return useQuery({
    queryKey: ["competitions", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("student_id", studentId!)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useFeedback(studentId?: string) {
  return useQuery({
    queryKey: ["feedback", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}

export function useHighlights(studentId?: string) {
  return useQuery({
    queryKey: ["highlights", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("highlights")
        .select("*")
        .eq("student_id", studentId!)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 60_000,
  })
}
