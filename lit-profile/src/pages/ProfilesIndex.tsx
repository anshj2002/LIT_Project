import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState } from "react"
import { useCurrentStudent } from "../state/currentStudent"

export default function ProfilesIndex() {
  const { data: students, refetch } = useQuery({
    queryKey: ["students-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:true})
      if (error) throw error
      return data
    }
  })
  const { currentStudentId, setCurrentStudentId } = useCurrentStudent()
  const [name, setName] = useState("")
  const [institution, setInstitution] = useState("")

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = name.trim().toLowerCase().replace(/\s+/g,"-")
    const { error } = await supabase.from("students").insert({ full_name: name, institution, slug })
    if (error) return alert(error.message)
    setName(""); setInstitution(""); await refetch()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>All Profiles</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {!students?.length && <p className="text-sm text-muted-foreground">No profiles yet.</p>}
          {students?.map((s:any)=>(
            <div key={s.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <div className="font-medium">{s.full_name}</div>
                <div className="text-xs text-muted-foreground">{s.institution}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={currentStudentId===s.id ? "default":"outline"} onClick={()=>setCurrentStudentId(s.id)}>
                  {currentStudentId===s.id ? "Active" : "Set Active"}
                </Button>
                <Link to={`/admin/${s.id}`} className="text-sm underline">Edit</Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Create New Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={createStudent} className="space-y-3">
            <Input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
            <Input placeholder="Institution" value={institution} onChange={(e)=>setInstitution(e.target.value)} />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
