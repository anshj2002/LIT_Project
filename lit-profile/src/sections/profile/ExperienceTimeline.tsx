import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function ExperienceTimeline({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["experiences", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("student_id", studentId)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Experience</h2>
      <div className="relative border-l border-border pl-6 space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="relative animate-pulse">
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-muted ring-4 ring-background" />
            <div className="flex items-start gap-3">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="space-y-1">
                <div className="h-4 w-48 bg-muted rounded"></div>
                <div className="h-8 w-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Experience</h2>
      <p className="text-sm text-muted-foreground">Couldn't load experience. Please try again.</p>
    </section>
  )

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Experience</h2>
      {!data?.length ? <Empty text="No experience yet."/> : (
        <ol className="relative border-l border-border pl-6 space-y-6">
          {data.map((e: any) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-foreground/80 ring-4 ring-background" />
              <div className="flex items-start gap-3">
                <div className="text-xs text-muted-foreground min-w-[140px] font-medium">
                  {e.start_date} – {e.end_date ?? "Present"}
                </div>
                <div>
                  <div className="font-medium text-sm">{e.role} • {e.company}</div>
                  {e.description && <p className="text-sm leading-relaxed mt-1">{e.description}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>
}
