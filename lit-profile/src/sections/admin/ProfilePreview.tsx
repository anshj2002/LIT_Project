import { useStudent, useSkills, useExperiences, useHighlights, useInterests, useEndorsements, useCompetitions, useFeedback } from "../../hooks/useStudentData"

export default function ProfilePreview() {
  const { data: student } = useStudent()
  const { data: skills } = useSkills(student?.id)
  const { data: experiences } = useExperiences(student?.id)
  const { data: highlights } = useHighlights(student?.id)
  const { data: interests } = useInterests(student?.id)
  const { data: endorsements } = useEndorsements(student?.id)
  const { data: competitions } = useCompetitions(student?.id)
  const { data: feedback } = useFeedback(student?.id)

  if (!student) return <p className="text-sm text-muted-foreground">No profile yet.</p>

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-3">
        {student.avatar_url ? (
          <img src={student.avatar_url} className="h-12 w-12 rounded-2xl object-cover border shadow-sm" />
        ) : <div className="h-12 w-12 rounded-2xl bg-muted border" />}
        <div>
          <div className="font-semibold text-sm">{student.full_name}</div>
          {student.institution && <div className="text-xs text-muted-foreground">{student.institution}</div>}
          {student.bio && <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">{student.bio}</div>}
        </div>
      </div>

      {/* Highlights */}
      {highlights?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Highlights</div>
          <div className="grid grid-cols-2 gap-2">
            {highlights.map((h: any) => (
              <div key={h.id} className="bg-muted/50 rounded p-2">
                <div className="text-xs text-muted-foreground">{h.label}</div>
                <div className="font-bold text-sm">{h.value}{h.unit}</div>
                {h.trend && <div className="text-xs">Trend: {h.trend}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Skills */}
      {skills?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Skills</div>
          <div className="space-y-2">
            {skills.map((s: any) => (
              <div key={s.id} className="bg-muted/50 rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.endorsements_count} endorsements</span>
                </div>
                <div className="h-1.5 bg-muted rounded">
                  <div className="h-1.5 bg-foreground/80 rounded" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Experience */}
      {experiences?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Experience</div>
          <div className="space-y-1">
            {experiences.map((e: any) => (
              <div key={e.id} className="bg-muted/50 rounded p-2">
                <div className="font-medium">{e.role}</div>
                <div className="text-xs text-muted-foreground">{e.company} • {e.start_date} – {e.end_date ?? "Present"}</div>
                {e.description && <div className="text-xs mt-1">{e.description}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Interests */}
      {interests?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Interests</div>
          <div className="flex flex-wrap gap-1">
            {interests.map((i: any) => (
              <span key={i.id} className="bg-muted/50 px-2 py-1 rounded-full text-xs">{i.name}</span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Endorsements */}
      {endorsements?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Endorsements</div>
          <div className="space-y-2">
            {endorsements.slice(0, 2).map((e: any) => (
              <div key={e.id} className="bg-muted/50 rounded p-2">
                <div className="font-medium text-xs">{e.reviewer_name}</div>
                <div className="text-xs text-muted-foreground">{e.comment}</div>
              </div>
            ))}
            {endorsements.length > 2 && <div className="text-xs text-muted-foreground">+{endorsements.length - 2} more</div>}
          </div>
        </div>
      ) : null}

      {/* Competitions */}
      {competitions?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Competitions</div>
          <div className="space-y-1">
            {competitions.slice(0, 2).map((c: any) => (
              <div key={c.id} className="bg-muted/50 rounded p-2">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.organization} • {c.achievement}</div>
              </div>
            ))}
            {competitions.length > 2 && <div className="text-xs text-muted-foreground">+{competitions.length - 2} more</div>}
          </div>
        </div>
      ) : null}

      {/* Feedback */}
      {feedback?.length ? (
        <div>
          <div className="font-semibold mb-2 text-sm">Feedback</div>
          <div className="space-y-1">
            {feedback.slice(0, 1).map((f: any) => (
              <div key={f.id} className="bg-muted/50 rounded p-2">
                <div className="font-medium text-xs">{f.type}</div>
                <div className="text-xs text-muted-foreground truncate">{f.comment || f.media_url}</div>
              </div>
            ))}
            {feedback.length > 1 && <div className="text-xs text-muted-foreground">+{feedback.length - 1} more</div>}
          </div>
        </div>
      ) : null}
    </div>
  )
}
