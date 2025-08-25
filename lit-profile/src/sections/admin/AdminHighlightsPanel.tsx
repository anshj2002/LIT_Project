import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { listHighlights, upsertHighlight, deleteHighlight, type Highlight } from "../../api/highlights"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function AdminHighlightsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const qc = useQueryClient()
  const { data: list } = useQuery({ queryKey: ["highlights", studentId], enabled: !!studentId, queryFn: ()=>listHighlights(studentId) })

  const save = useMutation({
    mutationFn: (p: Partial<Highlight> & { id?: string }) => upsertHighlight(p),
    onSettled: ()=> qc.invalidateQueries({ queryKey: ["highlights", studentId] })
  })
  const remove = useMutation({
    mutationFn: (id: string)=> deleteHighlight(id),
    onMutate: async (id)=>{ await qc.cancelQueries({ queryKey:["highlights",studentId] }); const prev=qc.getQueryData<Highlight[]>(["highlights",studentId])||[]; qc.setQueryData(["highlights",studentId], prev.filter(x=>x.id!==id)); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["highlights",studentId], ctx.prev),
    onSettled: ()=> qc.invalidateQueries({ queryKey:["highlights",studentId] })
  })

  const [label,setLabel]=useState(""); const [value,setValue]=useState<number|''>(''); const [unit,setUnit]=useState("%"); const [trend,setTrend]=useState("up")

  const add=(e:React.FormEvent)=>{ e.preventDefault(); if(!studentId) return; save.mutate({ student_id: studentId, label, value: value=== ''? null : Number(value), unit, trend, sort_order: (list?.length||0)+1 }); setLabel(""); setValue(''); setUnit("%"); setTrend("up") }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Highlights</h2>
      <form onSubmit={add} className="grid gap-2 md:grid-cols-5 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Label" value={label} onChange={e=>setLabel(e.target.value)} required/>
        <input className="border rounded-md px-3 py-2" placeholder="Value" value={value} onChange={e=>setValue(e.target.value as any)} />
        <input className="border rounded-md px-3 py-2" placeholder="Unit" value={unit} onChange={e=>setUnit(e.target.value)} />
        <select className="border rounded-md px-3 py-2" value={trend} onChange={e=>setTrend(e.target.value)}>
          <option value="up">up</option><option value="down">down</option><option value="flat">flat</option>
        </select>
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="space-y-2">
        {list?.map(x=>(
          <div key={x.id} className="grid md:grid-cols-[1fr,120px,100px,120px,auto] gap-2 items-center border rounded-xl p-2">
            <input className="border rounded-md px-3 py-2" defaultValue={x.label} onBlur={e=>save.mutate({ id:x.id, label:e.target.value })}/>
            <input className="border rounded-md px-3 py-2" defaultValue={x.value ?? ""} onBlur={e=>save.mutate({ id:x.id, value: Number(e.target.value) || null })}/>
            <input className="border rounded-md px-3 py-2" defaultValue={x.unit ?? ""} onBlur={e=>save.mutate({ id:x.id, unit: e.target.value || null })}/>
            <select className="border rounded-md px-3 py-2" defaultValue={x.trend ?? "up"} onBlur={e=>save.mutate({ id:x.id, trend: e.target.value || null })}>
              <option value="up">up</option><option value="down">down</option><option value="flat">flat</option>
            </select>
            <div className="flex justify-end"><button className="border rounded-md px-3 py-2" onClick={()=>remove.mutate(x.id)} type="button">Delete</button></div>
          </div>
        ))}
        {!list?.length && <p className="text-sm text-muted-foreground">No highlights yet.</p>}
      </div>
    </section>
  )
}
