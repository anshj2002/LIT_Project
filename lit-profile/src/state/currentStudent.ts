import { create } from "zustand"

type Store = {
  currentStudentId: string | null
  setCurrentStudentId: (id: string | null) => void
}

export const useCurrentStudent = create<Store>((set) => ({
  currentStudentId: (localStorage.getItem("currentStudentId") || null),
  setCurrentStudentId: (id: string | null) => {
    if (id) localStorage.setItem("currentStudentId", id)
    else localStorage.removeItem("currentStudentId")
    set({ currentStudentId: id })
  },
}))
