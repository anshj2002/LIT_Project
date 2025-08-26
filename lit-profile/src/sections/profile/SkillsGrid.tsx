import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'

function SkillsGrid({ studentId }: { studentId: string }) {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ["skills", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("student_id", studentId)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <Card>
      <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
              <div className="h-2 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Couldn't load skills. Please try again.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {!skills?.length ? (
          <p className="text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <div className="space-y-4">
            {skills.map((s: any) => (
              <div key={s.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.endorsements_count} endorsements</div>
                </div>
                <Progress value={s.level} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { SkillsGrid }
