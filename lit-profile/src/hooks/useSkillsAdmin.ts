import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listSkills, createSkill, updateSkill, deleteSkill, type Skill } from "../api/skills"
import { useCurrentStudent } from "../state/currentStudent"

export function useSkillsQuery() {
  const { currentStudentId } = useCurrentStudent()
  return useQuery({
    queryKey: ["skills", currentStudentId],
    enabled: !!currentStudentId,
    queryFn: () => listSkills(currentStudentId!),
    staleTime: 60_000,
  })
}

export function useCreateSkill() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Skill, "id">) => createSkill(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["skills", currentStudentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", currentStudentId]) || []
      const optimistic = [
        ...prev,
        { ...payload, id: "optimistic-" + Math.random().toString(36).slice(2) } as Skill,
      ]
      qc.setQueryData(["skills", currentStudentId], optimistic)
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", currentStudentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", currentStudentId] }),
  })
}

export function useUpdateSkill() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Skill> }) => updateSkill(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["skills", currentStudentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", currentStudentId]) || []
      qc.setQueryData(["skills", currentStudentId], prev.map(s => s.id === id ? { ...s, ...patch } : s))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", currentStudentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", currentStudentId] }),
  })
}

export function useDeleteSkill() {
  const { currentStudentId } = useCurrentStudent()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["skills", currentStudentId] })
      const prev = qc.getQueryData<Skill[]>(["skills", currentStudentId]) || []
      qc.setQueryData(["skills", currentStudentId], prev.filter(s => s.id !== id))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skills", currentStudentId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["skills", currentStudentId] }),
  })
}
