import { useStudent } from '../../hooks/useStudentData'
import { Card, CardContent } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'

export default function HeaderCard() {
  const { data: student, isLoading, error } = useStudent()

  if (isLoading) return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-16 w-96 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (error || !student) return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">Couldn't load profile. Please try again.</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <div className="relative">
        {/* Cover banner */}
        <div className="h-40 sm:h-56 w-full rounded-t-2xl bg-[url('/vite.svg')] bg-cover bg-center opacity-20" />
        {/* Avatar overlap */}
        <div className="absolute -bottom-10 left-6">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl ring-4 ring-background">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback className="rounded-2xl">{student.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-12 sm:pt-14 pb-6 px-6 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{student.full_name}</h1>
            {student.institution && <p className="text-sm text-muted-foreground">{student.institution}</p>}
          </div>
          {/* Social placeholders (match mock vibe) */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-xs">@</span>
            <span className="text-xs">in</span>
            <span className="text-xs">yt</span>
            <span className="text-xs">x</span>
          </div>
        </div>
        {student.bio && <p className="text-sm max-w-4xl leading-relaxed mt-1">{student.bio}</p>}
      </CardContent>
    </Card>
  )
}
