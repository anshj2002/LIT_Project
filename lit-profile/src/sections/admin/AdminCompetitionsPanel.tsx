import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { listCompetitions, createCompetition, updateCompetition, deleteCompetition, type Competition } from "../../api/competitions"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function AdminCompetitionsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const qc = useQueryClient()
  const { data: list } = useQuery({ queryKey: ["competitions", studentId], enabled: !!studentId, queryFn: ()=>listCompetitions(studentId) })

  const create = useMutation({
    mutationFn: (p: Omit<Competition,"id">)=> createCompetition(p),
    onMutate: async (p)=>{ await qc.cancelQueries({queryKey:["competitions",studentId]}); const prev=qc.getQueryData<Competition[]>(["competitions",studentId])||[]; qc.setQueryData(["competitions",studentId],[...prev,{...p,id:"opt-"+Math.random().toString(36).slice(2)} as Competition]); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["competitions",studentId],ctx.prev),
    onSettled: ()=> qc.invalidateQueries({queryKey:["competitions",studentId]})
  })
  const update = useMutation({
    mutationFn: ({id, patch}:{id:string; patch: Partial<Competition>})=> updateCompetition(id, patch),
    onMutate: async ({id,patch})=>{ await qc.cancelQueries({queryKey:["competitions",studentId]}); const prev=qc.getQueryData<Competition[]>(["competitions",studentId])||[]; qc.setQueryData(["competitions",studentId], prev.map(x=>x.id===id?{...x,...patch}:x)); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["competitions",studentId],ctx.prev),
    onSettled: ()=> qc.invalidateQueries({queryKey:["competitions",studentId]})
  })
  const remove = useMutation({
    mutationFn: (id:string)=> deleteCompetition(id),
    onMutate: async (id)=>{ await qc.cancelQueries({queryKey:["competitions",studentId]}); const prev=qc.getQueryData<Competition[]>(["competitions",studentId])||[]; qc.setQueryData(["competitions",studentId], prev.filter(x=>x.id!==id)); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["competitions",studentId],ctx.prev),
    onSettled: ()=> qc.invalidateQueries({queryKey:["competitions",studentId]})
  })

  const [name,setName]=useState(""); const [org,setOrg]=useState(""); const [role,setRole]=useState(""); const [ach,setAch]=useState("")

  const add=(e:React.FormEvent)=>{
    e.preventDefault()
    if(!studentId) return
    create.mutate({ student_id: studentId, name, org: org||null, role: role||null, start_date: null, end_date: null, achievement: ach||null, description: null, badge_url: null, sort_order: (list?.length||0)+1 })
    setName(""); setOrg(""); setRole(""); setAch("")
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Competitions / EPICs</h2>
      <form onSubmit={add} className="grid gap-2 md:grid-cols-5 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="border rounded-md px-3 py-2" placeholder="Org" value={org} onChange={e=>setOrg(e.target.value)}/>
        <input className="border rounded-md px-3 py-2" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)}/>
        <input className="border rounded-md px-3 py-2" placeholder="Achievement" value={ach} onChange={e=>setAch(e.target.value)}/>
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="space-y-2">
        {list?.map(x=>(
          <div key={x.id} className="grid md:grid-cols-[1fr,1fr,1fr,auto] gap-2 items-center border rounded-xl p-2">
            <input className="border rounded-md px-3 py-2" defaultValue={x.name} onBlur={e=>update.mutate({id:x.id, patch:{ name: e.target.value }})}/>
            <input className="border rounded-md px-3 py-2" defaultValue={x.org ?? ""} onBlur={e=>update.mutate({id:x.id, patch:{ org: e.target.value || null }})}/>
            <input className="border rounded-md px-3 py-2" defaultValue={x.achievement ?? ""} onBlur={e=>update.mutate({id:x.id, patch:{ achievement: e.target.value || null }})}/>
            <div className="flex justify-end">
              <button className="border rounded-md px-3 py-2" onClick={()=>remove.mutate(x.id)} type="button">Delete</button>
            </div>
          </div>
        ))}
        {!list?.length && <p className="text-sm text-muted-foreground">No competitions yet.</p>}
      </div>
    </section>
  )
}
