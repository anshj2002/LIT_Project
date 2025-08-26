import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import ProfilesIndex from "./ProfilesIndex"

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="max-w-sm">
        <Card>
          <CardHeader><CardTitle>Admin Sign-in</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={async () => {
              const emailRedirectTo = import.meta.env.DEV
                ? `${window.location.origin}/admin`
                : `https://YOUR-SITE.netlify.app/admin`
              const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo }
              })
              if (error) alert(error.message)
              else alert("Magic link sent. Check your email.")
            }}>Send magic link</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <ProfilesIndex />
}
