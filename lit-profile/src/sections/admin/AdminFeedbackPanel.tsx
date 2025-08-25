import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { listFeedback, createFeedback, deleteFeedback, type Feedback } from "../../api/feedback"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadPublicFile } from "../../lib/upload"

export function AdminFeedbackPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const qc = useQueryClient()
  const { data: list } = useQuery({ queryKey: ["feedback", studentId], enabled: !!studentId, queryFn: ()=>listFeedback(studentId) })

  const create = useMutation({
    mutationFn: (p: Omit<Feedback,"id">)=> createFeedback(p),
    onMutate: async (p)=>{ await qc.cancelQueries({queryKey:["feedback",studentId]}); const prev=qc.getQueryData<Feedback[]>(["feedback",studentId])||[]; qc.setQueryData(["feedback",studentId],[{...p,id:"opt-"+Math.random().toString(36).slice(2)} as Feedback,...prev]); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["feedback",studentId],ctx.prev),
    onSettled: ()=> qc.invalidateQueries({queryKey:["feedback",studentId]})
  })
  const remove = useMutation({
    mutationFn: (id:string)=> deleteFeedback(id),
    onMutate: async (id)=>{ await qc.cancelQueries({queryKey:["feedback",studentId]}); const prev=qc.getQueryData<Feedback[]>(["feedback",studentId])||[]; qc.setQueryData(["feedback",studentId], prev.filter(x=>x.id!==id)); return {prev}},
    onError: (_e,_v,ctx)=> ctx?.prev && qc.setQueryData(["feedback",studentId],ctx.prev),
    onSettled: ()=> qc.invalidateQueries({queryKey:["feedback",studentId]})
  })

  const [text,setText]=useState("")

  const addText=(e:React.FormEvent)=>{
    e.preventDefault()
    if(!studentId) return
    create.mutate({ student_id: studentId, kind: "text", text_content: text, media_url: null })
    setText("")
  }

  const onUpload = async (kind: "audio"|"video", file: File) => {
    const url = await uploadPublicFile({ file, bucket: "feedback-media", prefix: kind })
    create.mutate({ student_id: studentId, kind, text_content: null, media_url: url })
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Feedback</h2>
      <form onSubmit={addText} className="flex gap-2 mb-3">
        <input className="border rounded-md px-3 py-2 flex-1" placeholder="Add text feedback..." value={text} onChange={e=>setText(e.target.value)}/>
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="flex gap-2 mb-4">
        <label className="border rounded-md px-3 py-2 cursor-pointer">
          Upload audio
          <input type="file" accept="audio/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onUpload("audio", f) }} />
        </label>
        <label className="border rounded-md px-3 py-2 cursor-pointer">
          Upload video
          <input type="file" accept="video/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onUpload("video", f) }} />
        </label>
      </div>

      <ul className="space-y-2">
        {list?.map(x=>(
          <li key={x.id} className="border rounded-xl p-3">
            {x.kind === "text" && <div>{x.text_content}</div>}
            {x.kind !== "text" && x.media_url && (
              x.kind === "audio" ? <audio controls src={x.media_url} className="w-full" /> : <video controls src={x.media_url} className="w-full rounded-md" />
            )}
            <div className="mt-2 text-right">
              <button className="border rounded-md px-3 py-2" onClick={()=>remove.mutate(x.id)} type="button">Delete</button>
            </div>
          </li>
        ))}
        {!list?.length && <p className="text-sm text-muted-foreground">No feedback yet.</p>}
      </ul>
    </section>
  )
}
