import { useState } from "react"
import { useStudentQuery, useUpsertStudent } from "../../hooks/useStudentAdmin"
import { uploadPublicFile } from "../../lib/upload"

export function AdminStudentForm() {
  const { data: student, isLoading } = useStudentQuery()
  const upsert = useUpsertStudent()

  const [fullName, setFullName] = useState(student?.full_name ?? "")
  const [institution, setInstitution] = useState(student?.institution ?? "")
  const [bio, setBio] = useState(student?.bio ?? "")
  const [uploading, setUploading] = useState(false)

  // sync when query resolves
  // (simple pattern; you can refine with useEffect deps)
  if (!isLoading && student && fullName === "") {
    setTimeout(() => {
      setFullName(student.full_name ?? "")
      setInstitution(student.institution ?? "")
      setBio(student.bio ?? "")
    }, 0)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    upsert.mutate({
      id: student?.id,
      full_name: fullName,
      institution,
      bio,
    })
  }

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadPublicFile({ file, bucket: "profile-media", prefix: "avatars" })
      upsert.mutate({ id: student?.id, avatar_url: url })
    } catch (err: any) {
      alert(err.message ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Student Profile</h2>
        <label className="text-sm border rounded-md px-3 py-1 cursor-pointer">
          {uploading ? "Uploading..." : "Change Avatar"}
          <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
        </label>
      </div>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Full name</label>
          <input className="w-full border rounded-md px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Institution</label>
          <input className="w-full border rounded-md px-3 py-2" value={institution ?? ""} onChange={(e) => setInstitution(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Bio</label>
          <textarea className="w-full border rounded-md px-3 py-2 h-24" value={bio ?? ""} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <button className="border rounded-md px-4 py-2" disabled={upsert.isPending}>
            {upsert.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  )
}
