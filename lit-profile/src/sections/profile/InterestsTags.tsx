import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function InterestsTags({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interests", studentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("interests").select("*").eq("student_id", studentId)
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Interests</h2>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Interests</h2>
      <p className="text-sm text-muted-foreground">Couldn't load interests. Please try again.</p>
    </section>
  )

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Interests</h2>
      {!data?.length ? <Empty text="No interests yet."/> : (
        <div className="flex flex-wrap gap-2">
          {data.map((i:any)=>(
            <span key={i.id} className="inline-flex items-center gap-2 rounded-full border border-muted px-3 py-1 text-sm bg-background">
              <span className="text-muted-foreground">{i.category}</span>
              <strong className="text-foreground">{i.tag}</strong>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>
}
