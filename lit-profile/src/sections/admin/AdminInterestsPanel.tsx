import { useEffect, useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { listInterests, createInterest, deleteInterest, type Interest } from "../../api/interests"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function AdminInterestsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const qc = useQueryClient()
  const { data: interests } = useQuery({ queryKey: ["interests", studentId], enabled: !!studentId, queryFn: ()=>listInterests(studentId) })

  const create = useMutation({
    mutationFn: (p: Omit<Interest,"id">) => createInterest(p),
    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: ["interests", studentId] })
      const prev = qc.getQueryData<Interest[]>(["interests", studentId]) || []
      qc.setQueryData(["interests", studentId], [...prev, { ...p, id: "opt-"+Math.random().toString(36).slice(2)} as Interest])
      return { prev }
    },
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["interests", studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["interests", studentId] })
  })
  const remove = useMutation({
    mutationFn: (id: string)=> deleteInterest(id),
    onMutate: async (id)=>{
      await qc.cancelQueries({ queryKey: ["interests", studentId] })
      const prev = qc.getQueryData<Interest[]>(["interests", studentId]) || []
      qc.setQueryData(["interests", studentId], prev.filter(i=>i.id!==id))
      return { prev }
    },
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["interests", studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["interests", studentId] })
  })

  const [category,setCategory] = useState("Tech")
  const [tag,setTag] = useState("")

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return
    create.mutate({ student_id: studentId, category, tag })
    setTag("")
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Interests</h2>
      <form onSubmit={add} className="flex gap-2 mb-3">
        <input className="border rounded-md px-3 py-2" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="border rounded-md px-3 py-2 flex-1" placeholder="Tag (e.g. Robotics)" value={tag} onChange={e=>setTag(e.target.value)} required />
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="flex flex-wrap gap-2">
        {interests?.map(i=>(
          <span key={i.id} className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
            <span className="text-muted-foreground">{i.category}</span>
            <strong>{i.tag}</strong>
            <button onClick={()=>remove.mutate(i.id)} className="text-xs">✕</button>
          </span>
        ))}
        {!interests?.length && <p className="text-sm text-muted-foreground">No interests yet.</p>}
      </div>
    </section>
  )
}
