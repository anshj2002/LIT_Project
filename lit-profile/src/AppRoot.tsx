import { useRealtimeRefetch } from "./hooks/useRealtimeRefetch"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

const queryClient = new QueryClient()

function WithRealtime() {
  const qc = useQueryClient()
  useRealtimeRefetch(qc)
  return <App />
}

export default function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <WithRealtime />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
