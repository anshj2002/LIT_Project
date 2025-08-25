import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { QueryClient } from "@tanstack/react-query"

export function useRealtimeRefetch(queryClient: QueryClient) {
  useEffect(() => {
    const channels = [
      supabase.channel("students-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => queryClient.invalidateQueries({ queryKey: ["student"] })
      ),
      supabase.channel("skills-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        () => queryClient.invalidateQueries({ queryKey: ["skills"] })
      ),
      supabase.channel("exp-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "experiences" },
        () => queryClient.invalidateQueries({ queryKey: ["experiences"] })
      ),
      supabase.channel("interests-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "interests" },
        () => queryClient.invalidateQueries({ queryKey: ["interests"] })
      ),
      supabase.channel("endorsements-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "endorsements" },
        () => queryClient.invalidateQueries({ queryKey: ["endorsements"] })
      ),
      supabase.channel("competitions-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "competitions" },
        () => queryClient.invalidateQueries({ queryKey: ["competitions"] })
      ),
      supabase.channel("feedback-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        () => queryClient.invalidateQueries({ queryKey: ["feedback"] })
      ),
      supabase.channel("highlights-ch").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "highlights" },
        () => queryClient.invalidateQueries({ queryKey: ["highlights"] })
      ),
    ]

    channels.forEach((c) => c.subscribe())

    return () => { channels.forEach((c) => c.unsubscribe()) }
  }, [queryClient])
}
