import { useStudent } from '../hooks/useStudentData'
import HeaderCard from '../sections/profile/HeaderCard'
import { HighlightsGrid } from '../sections/profile/HighlightsGrid'
import { SkillsGrid } from '../sections/profile/SkillsGrid'
import { ExperienceTimeline } from '../sections/profile/ExperienceTimeline'
import { InterestsTags } from '../sections/profile/InterestsTags'
import { EndorsementsList } from '../sections/profile/EndorsementsList'
import { CompetitionsGrid } from '../sections/profile/CompetitionsGrid'
import { FeedbackList } from '../sections/profile/FeedbackList'

export default function Profile() {
  const { data: student, isLoading, error } = useStudent()

  if (isLoading) return (
    <div className="container py-8 space-y-8">
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-2xl mb-8" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (error || !student) return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground">Couldn't load profile. Please try again.</p>
      </div>
    </div>
  )

  return (
    <div className="container py-6 space-y-8">
      {/* Cover header with avatar and intro */}
      <HeaderCard />

      {/* Quick stats / highlights */}
      <HighlightsGrid studentId={student.id} />

      {/* Main two-column layout */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <ExperienceTimeline studentId={student.id} />
          <InterestsTags studentId={student.id} />
          <CompetitionsGrid studentId={student.id} />
          <FeedbackList studentId={student.id} />
        </div>
        <aside className="space-y-8">
          <SkillsGrid studentId={student.id} />
          <EndorsementsList studentId={student.id} />
        </aside>
      </div>
    </div>
  )
}
