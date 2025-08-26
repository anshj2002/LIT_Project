import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listExperiences, createExperience, updateExperience, deleteExperience, type Experience } from "../api/experiences"
import { useCurrentStudent } from "../state/currentStudent"

export function useExperiencesQuery() {
  const { currentStudentId } = useCurrentStudent()
  return useQuery({ queryKey: ["experiences", currentStudentId], enabled: !!currentStudentId, queryFn: () => listExperiences(currentStudentId!) })
}
export function useCreateExperience() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Omit<Experience,"id">) => createExperience(p),
    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: ["experiences", currentStudentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", currentStudentId]) || []
      qc.setQueryData(["experiences", currentStudentId], [...prev, { ...p, id: "opt-"+Math.random().toString(36).slice(2) } as Experience])
      return { prev }
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["experiences", currentStudentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", currentStudentId] })
  })
}
export function useUpdateExperience() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Experience>}) => updateExperience(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["experiences", currentStudentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", currentStudentId]) || []
      qc.setQueryData(["experiences", currentStudentId], prev.map(x => x.id === id ? { ...x, ...patch } : x))
      return { prev }
    },
    onError: (_e,_v,ctx) => ctx?.prev && qc.setQueryData(["experiences", currentStudentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", currentStudentId] })
  })
}
export function useDeleteExperience() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["experiences", currentStudentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", currentStudentId]) || []
      qc.setQueryData(["experiences", currentStudentId], prev.filter(x => x.id !== id))
      return { prev }
    },
    onError: (_e,_v,ctx) => ctx?.prev && qc.setQueryData(["experiences", currentStudentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", currentStudentId] })
  })
}
