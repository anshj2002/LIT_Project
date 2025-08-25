import { useStudent, useSkills, useExperiences, useInterests, useEndorsements, useCompetitions, useFeedback, useHighlights } from "../hooks/useStudentData"

export default function Profile() {
  const { data: student, isLoading: loadingStudent, error: errStudent } = useStudent()
  const { data: skills } = useSkills(student?.id)
  const { data: experiences } = useExperiences(student?.id)
  const { data: interests } = useInterests(student?.id)
  const { data: endorsements } = useEndorsements(student?.id)
  const { data: competitions } = useCompetitions(student?.id)
  const { data: feedback } = useFeedback(student?.id)
  const { data: highlights } = useHighlights(student?.id)

  if (loadingStudent) return <p>Loading profile…</p>
  if (errStudent || !student) return <p>Failed to load profile.</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border p-4 flex items-center gap-4">
        {student.avatar_url ? (
          <img src={student.avatar_url} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-muted" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{student.full_name}</h1>
          <p className="text-sm text-muted-foreground">{student.institution}</p>
          {student.bio && <p className="mt-1">{student.bio}</p>}
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Skills</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {skills?.map((s) => (
            <div key={s.id} className="border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.endorsements_count} endorsements</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full">
                <div className="h-2 bg-foreground/80 rounded-full" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Experience</h2>
        <div className="space-y-3">
          {experiences?.map((e) => (
            <div key={e.id} className="grid md:grid-cols-[auto,1fr] gap-3 items-start">
              <div className="text-sm text-muted-foreground min-w-[140px]">
                {e.start_date} — {e.end_date ?? "Present"}
              </div>
              <div>
                <div className="font-medium">{e.role} • {e.company}</div>
                {e.description && <div className="text-sm mt-1">{e.description}</div>}
              </div>
            </div>
          ))}
          {!experiences?.length && <p className="text-sm text-muted-foreground">No experience yet.</p>}
        </div>
      </section>

      {/* Interests */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {interests?.map((i) => (
            <span key={i.id} className="px-3 py-1 bg-muted rounded-full text-sm">
              {i.category}: {i.tag}
            </span>
          ))}
          {!interests?.length && <p className="text-sm text-muted-foreground">No interests yet.</p>}
        </div>
      </section>

      {/* Endorsements */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Endorsements</h2>
        <div className="space-y-3">
          {endorsements?.map((e) => (
            <div key={e.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                {e.reviewer_avatar_url ? (
                  <img src={e.reviewer_avatar_url} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted" />
                )}
                <div>
                  <div className="font-medium">{e.reviewer_name}</div>
                  {e.reviewer_title && <div className="text-sm text-muted-foreground">{e.reviewer_title}</div>}
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < e.rating ? 'text-yellow-500' : 'text-muted'}`}>★</span>
                  ))}
                </div>
              </div>
              {e.comment && <p className="text-sm">{e.comment}</p>}
            </div>
          ))}
          {!endorsements?.length && <p className="text-sm text-muted-foreground">No endorsements yet.</p>}
        </div>
      </section>

      {/* Competitions */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Competitions / EPICs</h2>
        <div className="space-y-3">
          {competitions?.map((c) => (
            <div key={c.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{c.name}</div>
                {c.achievement && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{c.achievement}</span>}
              </div>
              {c.org && <div className="text-sm text-muted-foreground">{c.org}</div>}
              {c.role && <div className="text-sm">{c.role}</div>}
              {c.start_date && (
                <div className="text-xs text-muted-foreground mt-1">
                  {c.start_date}{c.end_date ? ` — ${c.end_date}` : ''}
                </div>
              )}
              {c.description && <p className="text-sm mt-2">{c.description}</p>}
            </div>
          ))}
          {!competitions?.length && <p className="text-sm text-muted-foreground">No competitions yet.</p>}
        </div>
      </section>

      {/* Feedback */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Feedback</h2>
        <div className="space-y-3">
          {feedback?.map((f) => (
            <div key={f.id} className="border rounded-lg p-3">
              {f.kind === "text" && f.text_content && <p className="text-sm">{f.text_content}</p>}
              {f.kind === "audio" && f.media_url && (
                <audio controls src={f.media_url} className="w-full" />
              )}
              {f.kind === "video" && f.media_url && (
                <video controls src={f.media_url} className="w-full rounded-md" />
              )}
            </div>
          ))}
          {!feedback?.length && <p className="text-sm text-muted-foreground">No feedback yet.</p>}
        </div>
      </section>

      {/* Highlights */}
      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Highlights</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {highlights?.map((h) => (
            <div key={h.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{h.label}</span>
                <span className={`text-sm ${h.trend === 'up' ? 'text-green-600' : h.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {h.value}{h.unit}
                </span>
              </div>
            </div>
          ))}
          {!highlights?.length && <p className="text-sm text-muted-foreground">No highlights yet.</p>}
        </div>
      </section>
    </div>
  )
}
