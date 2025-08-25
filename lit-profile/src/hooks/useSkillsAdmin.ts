import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listSkills, createSkill, updateSkill, deleteSkill, type Skill } from "../api/skills"

export function useSkillsQuery(studentId?: string) {
  return useQuery({
    queryKey: ["skills", studentId],
    enabled: !!studentId,
    queryFn: () => listSkills(studentId!),
    staleTime: 60_000,
  })
}

export function useCreateSkill(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Skill, "id">) => createSkill(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["skills", studentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", studentId]) || []
      const optimistic = [
        ...prev,
        { ...payload, id: "optimistic-" + Math.random().toString(36).slice(2) } as Skill,
      ]
      qc.setQueryData(["skills", studentId], optimistic)
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", studentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", studentId] }),
  })
}

export function useUpdateSkill(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Skill> }) => updateSkill(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["skills", studentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", studentId]) || []
      qc.setQueryData(["skills", studentId], prev.map(s => s.id === id ? { ...s, ...patch } : s))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", studentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", studentId] }),
  })
}

export function useDeleteSkill(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["skills", studentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", studentId]) || []
      qc.setQueryData(["skills", studentId], prev.filter(s => s.id !== id))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", studentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", studentId] }),
  })
}
