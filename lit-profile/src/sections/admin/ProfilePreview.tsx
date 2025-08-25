import { useStudent, useSkills, useExperiences } from "../../hooks/useStudentData"

export default function ProfilePreview() {
  const { data: student } = useStudent()
  const { data: skills } = useSkills(student?.id)
  const { data: experiences } = useExperiences(student?.id)

  if (!student) return <p className="text-sm text-muted-foreground">No profile yet.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {student.avatar_url ? (
          <img src={student.avatar_url} className="h-12 w-12 rounded-full object-cover" />
        ) : <div className="h-12 w-12 rounded-full bg-muted" />}
        <div>
          <div className="font-semibold">{student.full_name}</div>
          <div className="text-xs text-muted-foreground">{student.institution}</div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Skills</div>
        <ul className="space-y-2">
          {skills?.map(s => (
            <li key={s.id}>
              <div className="flex justify-between text-sm">
                <span>{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.level}% • {s.endorsements_count} endorsements</span>
              </div>
              <div className="h-1.5 bg-muted rounded">
                <div className="h-1.5 bg-foreground/80 rounded" style={{ width: `${s.level}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="font-semibold mb-2">Experience</div>
        <div className="space-y-1 text-sm">
          {experiences?.map(e => (
            <div key={e.id}>{e.role} • {e.company} ({e.start_date} – {e.end_date ?? "Present"})</div>
          ))}
        </div>
      </div>
    </div>
  )
}
