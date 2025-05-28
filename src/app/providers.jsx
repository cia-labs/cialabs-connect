'use client'

import { createContext, useContext } from 'react'
import { supabase } from '@/lib/auth-actions' // ✅ This already contains your configured client

const SupabaseContext = createContext()

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)
