import { useState, useEffect } from "react"
import { useStudentQuery, useUpsertStudent } from "../../hooks/useStudentAdmin"
import { uploadPublicFile } from "../../lib/upload"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export function AdminStudentForm() {
  const { data: student } = useStudentQuery()
  const upsert = useUpsertStudent()

  const [fullName, setFullName] = useState("")
  const [institution, setInstitution] = useState("")
  const [bio, setBio] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (student) {
      setFullName(student.full_name ?? "")
      setInstitution(student.institution ?? "")
      setBio(student.bio ?? "")
    }
  }, [student])

  const onAvatarChange = async (file?: File) => {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadPublicFile({ file, bucket: "profile-media", prefix: "avatars" })
      upsert.mutate({ id: student?.id, avatar_url: url })
    } catch (e: any) {
      alert(e.message ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Student Profile</CardTitle>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-2xl">
            <AvatarImage src={student?.avatar_url ?? ""} />
            <AvatarFallback>{(student?.full_name ?? "A").charAt(0)}</AvatarFallback>
          </Avatar>
          <Button variant="outline" disabled={uploading} onClick={() => document.getElementById("avatar-input")?.click()}>
            {uploading ? "Uploading…" : "Change Avatar"}
          </Button>
          <input id="avatar-input" type="file" accept="image/*" className="hidden"
                 onChange={(e) => onAvatarChange(e.target.files?.[0])}/>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => { e.preventDefault(); upsert.mutate({ id: student?.id, full_name: fullName, institution, bio })}}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2 space-y-1.5">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Institution</Label>
            <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}/>
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
