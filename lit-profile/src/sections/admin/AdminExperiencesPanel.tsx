import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { useExperiencesQuery, useCreateExperience, useUpdateExperience, useDeleteExperience } from "../../hooks/useExperiencesAdmin"

export function AdminExperiencesPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id || ""
  const { data: experiences } = useExperiencesQuery(studentId)
  const create = useCreateExperience(studentId)
  const update = useUpdateExperience(studentId)
  const remove = useDeleteExperience(studentId)

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return
    create.mutate({
      student_id: studentId,
      company, role,
      start_date: start, end_date: end || null,
      description: null, logo_url: null, sort_order: (experiences?.length || 0) + 1
    })
    setCompany(""); setRole(""); setStart(""); setEnd("")
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Experience</h2>
      <form onSubmit={add} className="grid gap-2 md:grid-cols-5 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" type="date" value={start} onChange={e=>setStart(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" type="date" value={end} onChange={e=>setEnd(e.target.value)} />
        <button className="border rounded-md px-3 py-2">Add</button>
      </form>

      <div className="space-y-2">
        {experiences?.map(x => (
          <div key={x.id} className="grid md:grid-cols-[1fr,1fr,140px,140px,auto] gap-2 items-center border rounded-xl p-2">
            <input className="border rounded-md px-3 py-2" defaultValue={x.company} onBlur={e=>update.mutate({ id: x.id, patch:{ company: e.target.value }})}/>
            <input className="border rounded-md px-3 py-2" defaultValue={x.role} onBlur={e=>update.mutate({ id: x.id, patch:{ role: e.target.value }})}/>
            <input className="border rounded-md px-3 py-2" type="date" defaultValue={x.start_date} onBlur={e=>update.mutate({ id: x.id, patch:{ start_date: e.target.value }})}/>
            <input className="border rounded-md px-3 py-2" type="date" defaultValue={x.end_date ?? ""} onBlur={e=>update.mutate({ id: x.id, patch:{ end_date: e.target.value || null }})}/>
            <div className="flex justify-end">
              <button className="border rounded-md px-3 py-2" onClick={()=>remove.mutate(x.id)} type="button">Delete</button>
            </div>
          </div>
        ))}
        {!experiences?.length && <p className="text-sm text-muted-foreground">No experience yet.</p>}
      </div>
    </section>
  )
}
