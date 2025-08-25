import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { getFirstStudent, upsertStudent, type Student } from "../api/students"

export function useStudentQuery() {
  return useQuery({
    queryKey: ["student"],
    queryFn: getFirstStudent,
    staleTime: 60_000,
  })
}

export function useUpsertStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (partial: Partial<Student> & { id?: string }) => upsertStudent(partial),
    onMutate: async (partial) => {
      await qc.cancelQueries({ queryKey: ["student"] })
      const prev = qc.getQueryData<Student | null>(["student"])
      // optimistic: merge
      qc.setQueryData(["student"], (old: Student | null) => ({ ...(old ?? {} as Student), ...partial } as Student))
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        qc.setQueryData(["student"], ctx.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["student"] })
    },
  })
}
