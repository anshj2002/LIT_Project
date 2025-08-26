import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import ProfilePreview from "../sections/admin/ProfilePreview"
import { AdminStudentForm } from "../sections/admin/AdminStudentForm"
import { AdminSkillsPanel } from "../sections/admin/AdminSkillsPanel"
import { AdminExperiencesPanel } from "../sections/admin/AdminExperiencesPanel"
import { AdminInterestsPanel } from "../sections/admin/AdminInterestsPanel"
import { AdminEndorsementsPanel } from "../sections/admin/AdminEndorsementsPanel"
import { AdminCompetitionsPanel } from "../sections/admin/AdminCompetitionsPanel"
import { AdminFeedbackPanel } from "../sections/admin/AdminFeedbackPanel"
import { AdminHighlightsPanel } from "../sections/admin/AdminHighlightsPanel"
import { useCurrentStudent } from "../state/currentStudent"

export default function AdminStudent() {
  const { studentId } = useParams()
  const { setCurrentStudentId } = useCurrentStudent()
  useEffect(()=>{ if (studentId) setCurrentStudentId(studentId) }, [studentId])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
      <div className="space-y-6">
        <AdminStudentForm />
        <AdminSkillsPanel />
        <AdminExperiencesPanel />
        <AdminInterestsPanel />
        <AdminEndorsementsPanel />
        <AdminCompetitionsPanel />
        <AdminFeedbackPanel />
        <AdminHighlightsPanel />
      </div>

      <aside className="sticky top-24 h-fit">
        <Card>
          <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
          <CardContent><ProfilePreview /></CardContent>
        </Card>
      </aside>
    </div>
  )
}
