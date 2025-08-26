import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function HighlightsGrid({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["highlights", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("highlights")
        .select("*")
        .eq("student_id", studentId)
        .order("sort_order", { ascending: true })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Highlights</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-8 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Highlights</h2>
      <p className="text-sm text-muted-foreground">Couldn't load highlights. Please try again.</p>
    </section>
  )

  if (!data?.length) return null

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Highlights</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((h:any)=>(
          <div key={h.id} className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground mb-1">{h.label}</div>
            <div className="text-2xl font-bold mb-1">{h.value}{h.unit}</div>
            <div className="text-xs text-muted-foreground">Trend: {h.trend ?? "—"}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
