export default function Profile() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
      <p className="text-muted-foreground">Skeleton page. We'll wire real data in Step 2/3.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl border p-4">Header</section>
        <section className="rounded-2xl border p-4">Skills</section>
        <section className="rounded-2xl border p-4">Experience</section>
        <section className="rounded-2xl border p-4">Interests</section>
        <section className="rounded-2xl border p-4">Endorsements</section>
        <section className="rounded-2xl border p-4">Competitions / EPICs</section>
        <section className="rounded-2xl border p-4">Feedback</section>
        <section className="rounded-2xl border p-4">Highlights</section>
      </div>
    </div>
  )
}
