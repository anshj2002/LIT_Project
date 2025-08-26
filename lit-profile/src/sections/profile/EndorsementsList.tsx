import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function EndorsementsList({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["endorsements", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("endorsements")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Endorsements</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-12 bg-muted rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Endorsements</h2>
      <p className="text-sm text-muted-foreground">Couldn't load endorsements. Please try again.</p>
    </section>
  )

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Endorsements</h2>
      {!data?.length ? <Empty text="No endorsements yet."/> : (
        <div className="space-y-4">
          {data.map((x:any)=>(
            <article key={x.id} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{x.reviewer_name}</div>
                  {x.reviewer_title && <div className="text-xs text-muted-foreground">{x.reviewer_title}</div>}
                </div>
                <div className="text-sm font-medium">⭐ {x.rating}/5</div>
              </div>
              {x.comment && <p className="text-sm leading-relaxed">{x.comment}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
function Empty({ text }: { text: string }) { return <p className="text-sm text-muted-foreground">{text}</p> }
