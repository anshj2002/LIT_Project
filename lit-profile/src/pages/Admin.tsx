import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { AdminStudentForm } from "../sections/admin/AdminStudentForm"
import { AdminSkillsPanel } from "../sections/admin/AdminSkillsPanel"
import { AdminExperiencesPanel } from "../sections/admin/AdminExperiencesPanel"
import { AdminInterestsPanel } from "../sections/admin/AdminInterestsPanel"
import { AdminEndorsementsPanel } from "../sections/admin/AdminEndorsementsPanel"
import { AdminCompetitionsPanel } from "../sections/admin/AdminCompetitionsPanel"
import { AdminFeedbackPanel } from "../sections/admin/AdminFeedbackPanel"
import { AdminHighlightsPanel } from "../sections/admin/AdminHighlightsPanel"
import ProfilePreview from "../sections/admin/ProfilePreview"

export default function Admin() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) {
    return <AuthForm />
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
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
      <aside className="rounded-2xl border p-4 sticky top-20 h-fit">
        <h2 className="font-semibold mb-3">Live Preview</h2>
        <ProfilePreview />
      </aside>
    </div>
  )
}

function AuthForm() {
  const [email, setEmail] = useState("")
  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert("Magic link sent. Check your email.")
  }
  return (
    <form onSubmit={sendMagicLink} className="space-y-3 max-w-sm">
      <h1 className="text-2xl font-bold">Admin Sign-in</h1>
      <input
        className="w-full border rounded-md px-3 py-2"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="border rounded-md px-3 py-2">Send magic link</button>
    </form>
  )
}
