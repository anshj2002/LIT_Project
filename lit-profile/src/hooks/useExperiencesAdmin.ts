import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listExperiences, createExperience, updateExperience, deleteExperience, type Experience } from "../api/experiences"

export function useExperiencesQuery(studentId?: string) {
  return useQuery({ queryKey: ["experiences", studentId], enabled: !!studentId, queryFn: () => listExperiences(studentId!) })
}
export function useCreateExperience(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Omit<Experience,"id">) => createExperience(p),
    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: ["experiences", studentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", studentId]) || []
      qc.setQueryData(["experiences", studentId], [...prev, { ...p, id: "opt-"+Math.random().toString(36).slice(2) } as Experience])
      return { prev }
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["experiences", studentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", studentId] })
  })
}
export function useUpdateExperience(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Experience>}) => updateExperience(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["experiences", studentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", studentId]) || []
      qc.setQueryData(["experiences", studentId], prev.map(x => x.id === id ? { ...x, ...patch } : x))
      return { prev }
    },
    onError: (_e,_v,ctx) => ctx?.prev && qc.setQueryData(["experiences", studentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", studentId] })
  })
}
export function useDeleteExperience(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["experiences", studentId] })
      const prev = qc.getQueryData<Experience[]>(["experiences", studentId]) || []
      qc.setQueryData(["experiences", studentId], prev.filter(x => x.id !== id))
      return { prev }
    },
    onError: (_e,_v,ctx) => ctx?.prev && qc.setQueryData(["experiences", studentId], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["experiences", studentId] })
  })
}
