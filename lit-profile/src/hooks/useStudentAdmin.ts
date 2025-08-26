import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabase"
import { useCurrentStudent } from "../state/currentStudent"

export function useStudentQuery() {
  const { currentStudentId } = useCurrentStudent()
  return useQuery({
    queryKey: ["student-admin", currentStudentId],
    enabled: !!currentStudentId,
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("id", currentStudentId!).single()
      if (error) throw error; return data
    },
    staleTime: 60_000,
  })
}

export function useUpsertStudent() {
  const qc = useQueryClient()
  const { currentStudentId } = useCurrentStudent()
  return useMutation({
    mutationFn: async (patch: any) => {
      if (currentStudentId) {
        const { error } = await supabase.from("students").update(patch).eq("id", currentStudentId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("students").insert(patch)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-admin", currentStudentId] })
      qc.invalidateQueries({ queryKey: ["student", currentStudentId ?? "first"] })
    }
  })
}
