import { useState } from "react"
import { useStudentQuery } from "../../hooks/useStudentAdmin"
import { useSkillsQuery } from "../../hooks/useSkillsAdmin"
import { supabase } from "../../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"

export function AdminSkillsPanel() {
  const { data: student } = useStudentQuery()
  const studentId = student?.id
  const { data: skills, refetch } = useSkillsQuery(studentId)

  const [name, setName] = useState("")
  const [level, setLevel] = useState(70)
  const [endorsements, setEndorsements] = useState(0)
  const [category, setCategory] = useState("Programming")

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return
    console.log("Add skill", { student_id: studentId, name, level: Number(level), endorsements_count: Number(endorsements), category })
    const { error } = await supabase.from("skills").insert({
      student_id: studentId,
      name,
      level: Number(level),
      endorsements_count: Number(endorsements),
      category,
      sort_order: (skills?.length || 0) + 1,
    })
    if (error) { console.error(error); alert(error.message); }
    else { refetch(); setName(""); setLevel(70); setEndorsements(0) }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Python" required/></div>
          <div className="space-y-1.5"><Label>Level %</Label><Input type="number" min={0} max={100} value={level} onChange={e=>setLevel(Number(e.target.value))}/></div>
          <div className="space-y-1.5"><Label>Endorsements</Label><Input type="number" min={0} value={endorsements} onChange={e=>setEndorsements(Number(e.target.value))}/></div>
          <div className="flex items-end gap-2">
            <Input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category"/>
            <Button type="submit">Add</Button>
          </div>
        </form>

        <div className="space-y-2">
          {skills?.map(s => (
            <div key={s.id} className="grid md:grid-cols-[1fr,140px,160px,auto] gap-2 items-center">
              <Input
                defaultValue={s.name}
                onBlur={async (e) => {
                  const name = e.target.value;
                  console.log("Update skill name", s.id, name);
                  const { error } = await supabase.from("skills").update({ name }).eq("id", s.id);
                  if (error) { console.error(error); alert(error.message); }
                  else { refetch(); }
                }}
              />
              <Input
                type="number" min={0} max={100} defaultValue={s.level}
                onBlur={async (e) => {
                  const level = Number(e.target.value);
                  console.log("Update skill level", s.id, level);
                  const { error } = await supabase.from("skills").update({ level }).eq("id", s.id);
                  if (error) { console.error(error); alert(error.message); }
                  else { refetch(); }
                }}
              />
              <Input
                type="number" min={0} defaultValue={s.endorsements_count}
                onBlur={async (e) => {
                  const endorsements_count = Number(e.target.value);
                  console.log("Update endorsements", s.id, endorsements_count);
                  const { error } = await supabase.from("skills").update({ endorsements_count }).eq("id", s.id);
                  if (error) { console.error(error); alert(error.message); }
                  else { refetch(); }
                }}
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    console.log("Delete skill", s.id)
                    const { error } = await supabase.from("skills").delete().eq("id", s.id)
                    if (error) { console.error(error); alert(error.message) }
                    else { refetch(); }
                  }}
                >Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
