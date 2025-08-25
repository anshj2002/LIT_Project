import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { listEndorsements, createEndorsement, updateEndorsement, deleteEndorsement, type Endorsement } from "../../api/endorsements"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function AdminEndorsementsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const qc = useQueryClient()
  const { data: list } = useQuery({ queryKey: ["endorsements", studentId], enabled: !!studentId, queryFn: ()=>listEndorsements(studentId) })

  const create = useMutation({
    mutationFn: (p: Omit<Endorsement,"id">) => createEndorsement(p),
    onMutate: async (p)=>{
      await qc.cancelQueries({ queryKey: ["endorsements", studentId] })
      const prev = qc.getQueryData<Endorsement[]>(["endorsements", studentId]) || []
      qc.setQueryData(["endorsements", studentId], [{...p, id:"opt-"+Math.random().toString(36).slice(2)} as Endorsement, ...prev])
      return { prev }
    },
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["endorsements", studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["endorsements", studentId] })
  })
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Endorsement>}) => updateEndorsement(id, patch),
    onMutate: async ({ id, patch })=>{
      await qc.cancelQueries({ queryKey: ["endorsements", studentId] })
      const prev = qc.getQueryData<Endorsement[]>(["endorsements", studentId]) || []
      qc.setQueryData(["endorsements", studentId], prev.map(x=>x.id===id?{...x,...patch}:x))
      return { prev }
    },
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["endorsements", studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["endorsements", studentId] })
  })
  const remove = useMutation({
    mutationFn: (id: string)=> deleteEndorsement(id),
    onMutate: async (id)=>{
      await qc.cancelQueries({ queryKey: ["endorsements", studentId] })
      const prev = qc.getQueryData<Endorsement[]>(["endorsements", studentId]) || []
      qc.setQueryData(["endorsements", studentId], prev.filter(x=>x.id!==id))
      return { prev }
    },
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["endorsements", studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["endorsements", studentId] })
  })

  const [name,setName]=useState(""); const [title,setTitle]=useState(""); const [rating,setRating]=useState(5); const [comment,setComment]=useState("")

  const add=(e:React.FormEvent)=>{
    e.preventDefault()
    if(!studentId) return
    create.mutate({ student_id: studentId, reviewer_name: name, reviewer_title: title || null, rating, comment: comment || null, reviewer_avatar_url: null })
    setName(""); setTitle(""); setRating(5); setComment("")
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Endorsements</h2>
      <form onSubmit={add} className="grid gap-2 md:grid-cols-5 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Reviewer name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="border rounded-md px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
        <input className="border rounded-md px-3 py-2" type="number" min={1} max={5} value={rating} onChange={e=>setRating(Number(e.target.value))}/>
        <input className="border rounded-md px-3 py-2 md:col-span-2" placeholder="Comment" value={comment} onChange={e=>setComment(e.target.value)}/>
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="space-y-2">
        {list?.map(x=>(
          <div key={x.id} className="border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <input className="border rounded-md px-2 py-1 font-medium" defaultValue={x.reviewer_name} onBlur={e=>update.mutate({id:x.id, patch:{ reviewer_name: e.target.value }})}/>
              <input className="border rounded-md px-2 py-1 w-16" type="number" min={1} max={5} defaultValue={x.rating} onBlur={e=>update.mutate({id:x.id, patch:{ rating: Number(e.target.value) }})}/>
            </div>
            <input className="mt-2 w-full border rounded-md px-2 py-1 text-sm" defaultValue={x.reviewer_title ?? ""} onBlur={e=>update.mutate({id:x.id, patch:{ reviewer_title: e.target.value || null }})}/>
            <textarea className="mt-2 w-full border rounded-md px-2 py-1 text-sm" defaultValue={x.comment ?? ""} onBlur={e=>update.mutate({id:x.id, patch:{ comment: e.target.value || null }})}/>
            <div className="mt-2 flex justify-end"><button className="border rounded-md px-3 py-2" onClick={()=>remove.mutate(x.id)} type="button">Delete</button></div>
          </div>
        ))}
        {!list?.length && <p className="text-sm text-muted-foreground">No endorsements yet.</p>}
      </div>
    </section>
  )
}
