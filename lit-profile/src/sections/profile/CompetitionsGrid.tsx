import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function CompetitionsGrid({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["competitions", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("student_id", studentId)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Competitions / EPICs</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mb-1"></div>
            <div className="h-3 w-24 bg-muted rounded mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Competitions / EPICs</h2>
      <p className="text-sm text-muted-foreground">Couldn't load competitions. Please try again.</p>
    </section>
  )

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Competitions / EPICs</h2>
      {!data?.length ? <Empty text="No competitions yet."/> : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((c:any)=>(
            <article key={c.id} className="rounded-xl border p-4">
              <div className="font-medium text-sm mb-1">{c.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{c.organization} {c.role ? `• ${c.role}` : ""}</div>
              {c.achievement && <div className="text-sm font-medium mb-1">Achievement: {c.achievement}</div>}
              {c.description && <p className="text-sm leading-relaxed">{c.description}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
function Empty({ text }: { text: string }) { return <p className="text-sm text-muted-foreground">{text}</p> }
