import { supabase } from '../../lib/supabase'
import { useQuery } from "@tanstack/react-query"

export function FeedbackList({ studentId }: { studentId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feedback", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    }
  })

  if (isLoading) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>
      <p className="text-sm text-muted-foreground">Couldn't load feedback. Please try again.</p>
    </section>
  )

  return (
    <section className="rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>
      {!data?.length ? <Empty text="No feedback yet."/> : (
        <div className="space-y-4">
          {data.map((f:any)=>(
            <article key={f.id} className="rounded-xl border p-4">
              {f.kind === "text" && <p className="text-sm leading-relaxed">{f.text_content}</p>}
              {f.kind === "audio" && f.media_url && (
                <audio controls className="w-full">
                  <source src={f.media_url} />
                  Your browser does not support the audio element.
                </audio>
              )}
              {f.kind === "video" && f.media_url && (
                <video controls className="w-full rounded-lg">
                  <source src={f.media_url} />
                  Your browser does not support the video element.
                </video>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
function Empty({ text }: { text: string }) { return <p className="text-sm text-muted-foreground">{text}</p> }
