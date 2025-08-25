import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { useSkillsQuery, useCreateSkill, useUpdateSkill, useDeleteSkill } from "../../hooks/useSkillsAdmin"

export function AdminSkillsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id
  const { data: skills } = useSkillsQuery(studentId)

  const create = useCreateSkill(studentId || "")
  const update = useUpdateSkill(studentId || "")
  const remove = useDeleteSkill(studentId || "")

  const [name, setName] = useState("")
  const [level, setLevel] = useState(70)
  const [endorsements, setEndorsements] = useState(0)
  const [category, setCategory] = useState("Programming")

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return alert("No student found")
    create.mutate({
      student_id: studentId,
      name,
      level: Number(level),
      endorsements_count: Number(endorsements),
      category,
      sort_order: (skills?.length || 0) + 1,
    })
    setName("")
    setLevel(70)
    setEndorsements(0)
  }

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-semibold mb-3">Skills</h2>

      {/* Add new */}
      <form onSubmit={addSkill} className="grid gap-2 md:grid-cols-4 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Name (e.g. Python)" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" type="number" min={0} max={100} placeholder="Level %" value={level} onChange={e => setLevel(Number(e.target.value))} />
        <input className="border rounded-md px-3 py-2" type="number" min={0} placeholder="Endorsements" value={endorsements} onChange={e => setEndorsements(Number(e.target.value))} />
        <div className="flex gap-2">
          <input className="border rounded-md px-3 py-2 flex-1" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <button className="border rounded-md px-3 py-2">Add</button>
        </div>
      </form>

      {/* List + inline edit */}
      <div className="space-y-2">
        {skills?.map(s => (
          <div key={s.id} className="grid md:grid-cols-[1fr,140px,140px,auto] gap-2 items-center border rounded-xl p-2">
            <input
              className="border rounded-md px-3 py-2"
              defaultValue={s.name}
              onBlur={(e) => update.mutate({ id: s.id, patch: { name: e.target.value } })}
            />
            <input
              className="border rounded-md px-3 py-2"
              type="number" min={0} max={100}
              defaultValue={s.level}
              onBlur={(e) => update.mutate({ id: s.id, patch: { level: Number(e.target.value) } })}
            />
            <input
              className="border rounded-md px-3 py-2"
              type="number" min={0}
              defaultValue={s.endorsements_count}
              onBlur={(e) => update.mutate({ id: s.id, patch: { endorsements_count: Number(e.target.value) } })}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="border rounded-md px-3 py-2"
                onClick={() => remove.mutate(s.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!skills?.length && <p className="text-sm text-muted-foreground">No skills yet.</p>}
      </div>
    </section>
  )
}
