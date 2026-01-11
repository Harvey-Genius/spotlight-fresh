import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const notConfiguredError = { message: 'Supabase not configured. Update .env.local with your credentials.' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [providerToken, setProviderToken] = useState(() => {
    // Try to restore from localStorage on init
    return localStorage.getItem('gmail_provider_token')
  })

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Capture provider token if available
      if (session?.provider_token) {
        setProviderToken(session.provider_token)
        localStorage.setItem('gmail_provider_token', session.provider_token)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Provider token:', session?.provider_token ? 'present' : 'missing')
      setSession(session)
      setUser(session?.user ?? null)
      // Capture provider token when it's available (after OAuth redirect)
      if (session?.provider_token) {
        console.log('Storing provider token')
        setProviderToken(session.provider_token)
        localStorage.setItem('gmail_provider_token', session.provider_token)
      }
      // Clear token on sign out
      if (event === 'SIGNED_OUT') {
        setProviderToken(null)
        localStorage.removeItem('gmail_provider_token')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: notConfiguredError }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: notConfiguredError }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: notConfiguredError }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    return { data, error }
  }

  // Get the provider access token for Gmail API calls
  const getProviderToken = () => {
    return providerToken || session?.provider_token || null
  }

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null }
    }
    // Clear stored provider token
    setProviderToken(null)
    localStorage.removeItem('gmail_provider_token')
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getProviderToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
