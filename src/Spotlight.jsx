import { useState, useRef, useEffect } from 'react'

// Icons
const SparkleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    <path d="M19 15l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z" opacity="0.7"/>
    <path d="M5 17l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" opacity="0.5"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 7l-10 5L2 7"/>
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8"/>
  </svg>
)

const ChevronIcon = ({ direction = 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}>
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)

const CrownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
)

// View states
const VIEWS = {
  WELCOME: 'welcome',
  AUTH: 'auth',
  GMAIL_CONNECT: 'gmail_connect',
  CHAT: 'chat',
  SETTINGS: 'settings',
  ACCOUNT: 'account',
  UPGRADE: 'upgrade'
}

// Quick action presets
const QUICK_ACTIONS = [
  { label: 'Assignments', query: 'Find my recent assignment emails', icon: '📚' },
  { label: 'Grades', query: 'Show emails about my grades', icon: '📊' },
  { label: 'Professors', query: 'Emails from my professors', icon: '👨‍🏫' },
  { label: 'Deadlines', query: 'Upcoming deadlines and due dates', icon: '⏰' }
]

// Mock email data
const MOCK_EMAILS = [
  {
    id: 1,
    sender: 'Prof. Sarah Chen',
    email: 'schen@university.edu',
    subject: 'CS 101 - Assignment 3 Due Date Extended',
    preview: 'Hi class, I wanted to let you know that the deadline for Assignment 3 has been extended to...',
    time: '2h ago',
    isUnread: true
  },
  {
    id: 2,
    sender: 'Academic Office',
    email: 'registrar@university.edu',
    subject: 'Spring 2025 Registration Now Open',
    preview: 'Dear Student, Registration for Spring 2025 courses is now available. Please log in to your...',
    time: '5h ago',
    isUnread: true
  },
  {
    id: 3,
    sender: 'Dr. Michael Torres',
    email: 'mtorres@university.edu',
    subject: 'Re: Office Hours Question',
    preview: 'Thanks for reaching out! Yes, I can meet with you during my Thursday office hours at 2pm...',
    time: 'Yesterday',
    isUnread: false
  }
]

export default function Spotlight() {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [view, setView] = useState(VIEWS.WELCOME)
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [queriesUsed, setQueriesUsed] = useState(7)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  const maxQueries = user?.isPro ? 60 : 15
  const queryPercentage = (queriesUsed / maxQueries) * 100

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (view === VIEWS.CHAT && inputRef.current) {
      inputRef.current.focus()
    }
  }, [view])

  const handleGoogleSignIn = () => {
    setView(VIEWS.GMAIL_CONNECT)
  }

  const handleGmailConnect = () => {
    setUser({
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      avatar: null,
      isPro: false
    })
    setView(VIEWS.CHAT)
  }

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim() || isLoading) return
    if (queriesUsed >= maxQueries) {
      setShowUpgradeModal(true)
      return
    }

    const userMessage = { type: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setQueriesUsed(prev => prev + 1)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        text: `I found ${MOCK_EMAILS.length} emails matching your search.`,
        emails: MOCK_EMAILS
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickAction = (action) => {
    handleSendMessage(action.query)
  }

  const handleUpgrade = () => {
    setUser(prev => ({ ...prev, isPro: true }))
    setShowUpgradeModal(false)
  }

  // Theme classes
  const theme = {
    bg: darkMode ? 'bg-gray-900/95' : 'bg-white/90',
    bgSolid: darkMode ? 'bg-gray-900' : 'bg-white',
    bgSecondary: darkMode ? 'bg-gray-800/50' : 'bg-gray-50',
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/50',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    textMuted: darkMode ? 'text-gray-500' : 'text-gray-400',
    gradient: darkMode
      ? 'from-purple-600 to-indigo-700'
      : 'from-orange-400 to-amber-500',
    gradientAlt: darkMode
      ? 'from-indigo-500 to-purple-600'
      : 'from-sky-400 to-blue-500',
    input: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
  }

  // Welcome View
  const WelcomeView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white mb-6 shadow-lg animate-float`}
      >
        <SparkleIcon size={28} />
      </div>
      <h2 className={`text-xl font-semibold ${theme.text} mb-2 opacity-0 animate-fade-up animation-delay-100`}>
        Welcome to Spotlight
      </h2>
      <p className={`text-sm ${theme.textSecondary} text-center mb-8 opacity-0 animate-fade-up animation-delay-200`}>
        AI-powered search for your school emails
      </p>
      <button
        onClick={() => setView(VIEWS.AUTH)}
        className={`px-6 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 animate-fade-up animation-delay-300`}
      >
        Get Started
      </button>
    </div>
  )

  // Auth View
  const AuthView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}
      >
        <SparkleIcon size={24} />
      </div>
      <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>Sign in to continue</h2>
      <p className={`text-sm ${theme.textSecondary} text-center mb-6`}>
        Use your school Google account
      </p>
      <button
        onClick={handleGoogleSignIn}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl ${theme.bgSecondary} border ${theme.border} ${theme.text} font-medium text-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]`}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  )

  // Gmail Connect View
  const GmailConnectView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className={`w-14 h-14 rounded-2xl ${theme.bgSecondary} flex items-center justify-center mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
        <MailIcon />
      </div>
      <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>Connect Gmail</h2>
      <p className={`text-sm ${theme.textSecondary} text-center mb-6 max-w-[260px]`}>
        Allow Spotlight to search your emails securely
      </p>
      <div className={`w-full max-w-[260px] rounded-xl ${theme.bgSecondary} p-4 mb-6`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className={`text-xs ${theme.textSecondary}`}>Read-only access</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className={`text-xs ${theme.textSecondary}`}>End-to-end encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className={`text-xs ${theme.textSecondary}`}>Revoke anytime</span>
        </div>
      </div>
      <button
        onClick={handleGmailConnect}
        className={`px-6 py-3 rounded-xl bg-gradient-to-r ${theme.gradientAlt} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}
      >
        Connect Gmail
      </button>
    </div>
  )

  // Query Limit Bar
  const QueryLimitBar = () => (
    <button
      onClick={() => !user?.isPro && setShowUpgradeModal(true)}
      className={`mx-4 mb-3 p-3 rounded-xl ${theme.bgSecondary} ${!user?.isPro ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} transition-opacity`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${theme.textSecondary}`}>
          {user?.isPro ? 'Pro Plan' : 'Free Plan'}
        </span>
        <span className={`text-xs ${theme.textMuted}`}>
          {queriesUsed}/{maxQueries} queries
        </span>
      </div>
      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${queryPercentage > 80 ? 'from-red-400 to-red-500' : theme.gradient} transition-all duration-500`}
          style={{ width: `${queryPercentage}%` }}
        />
      </div>
    </button>
  )

  // Chat View
  const ChatView = () => (
    <div className="flex-1 flex flex-col min-h-0">
      <QueryLimitBar />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white mb-4 opacity-50`}>
              <SparkleIcon size={20} />
            </div>
            <p className={`text-sm ${theme.textSecondary} text-center mb-6`}>
              Ask me to find any email
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-[300px]">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action)}
                  className={`px-3 py-2 rounded-lg ${theme.bgSecondary} ${theme.text} text-xs font-medium ${theme.hover} transition-colors flex items-center gap-1.5`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.type === 'user'
                  ? `bg-gradient-to-r ${theme.gradient} text-white rounded-2xl rounded-br-md px-4 py-2.5`
                  : ''}`}
                >
                  {msg.type === 'user' ? (
                    <p className="text-sm">{msg.text}</p>
                  ) : (
                    <div>
                      <p className={`text-sm ${theme.text} mb-3`}>{msg.text}</p>
                      {msg.emails && (
                        <div className="space-y-2">
                          {msg.emails.map(email => (
                            <EmailCard key={email.id} email={email} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${theme.bgSecondary}`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-pulse-soft`}></div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-pulse-soft animation-delay-100`}></div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-pulse-soft animation-delay-200`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${theme.border}`}>
        <div className={`flex items-center gap-2 p-2 rounded-xl ${theme.input} border`}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Search your emails..."
            className={`flex-1 bg-transparent outline-none text-sm ${theme.text} placeholder:${theme.textMuted} px-2`}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-2 rounded-lg bg-gradient-to-r ${theme.gradient} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )

  // Email Card
  const EmailCard = ({ email }) => (
    <div className={`p-3 rounded-xl ${theme.bgSecondary} border ${theme.border} cursor-pointer ${theme.hover} transition-colors`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradientAlt} flex items-center justify-center text-white text-xs font-medium shrink-0`}>
          {email.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-sm font-medium ${theme.text} truncate`}>{email.sender}</span>
            <span className={`text-[10px] ${theme.textMuted} shrink-0`}>{email.time}</span>
          </div>
          <p className={`text-sm ${email.isUnread ? theme.text : theme.textSecondary} font-medium truncate mb-0.5`}>
            {email.subject}
          </p>
          <p className={`text-xs ${theme.textMuted} line-clamp-2`}>{email.preview}</p>
        </div>
        {email.isUnread && (
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} shrink-0 mt-1`}></div>
        )}
      </div>
    </div>
  )

  // Settings View
  const SettingsView = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <button
        onClick={() => setView(VIEWS.CHAT)}
        className={`flex items-center gap-1 ${theme.textSecondary} text-sm mb-4 ${theme.hover} rounded-lg px-2 py-1 -ml-2`}
      >
        <ChevronIcon direction="left" />
        Back
      </button>
      <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Settings</h2>

      <div className="space-y-2">
        <div className={`flex items-center justify-between p-4 rounded-xl ${theme.bgSecondary}`}>
          <div className="flex items-center gap-3">
            {darkMode ? <MoonIcon /> : <SunIcon />}
            <span className={`text-sm ${theme.text}`}>Dark Mode</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-colors ${darkMode ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-300'} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  )

  // Account View
  const AccountView = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <button
        onClick={() => setView(VIEWS.CHAT)}
        className={`flex items-center gap-1 ${theme.textSecondary} text-sm mb-4 ${theme.hover} rounded-lg px-2 py-1 -ml-2`}
      >
        <ChevronIcon direction="left" />
        Back
      </button>

      {/* User Info */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${theme.bgSecondary} mb-4`}>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-medium`}>
          {user?.name?.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${theme.text}`}>{user?.name}</h3>
          <p className={`text-xs ${theme.textMuted}`}>{user?.email}</p>
        </div>
        {user?.isPro && (
          <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white text-[10px] font-bold flex items-center gap-1`}>
            <CrownIcon />
            PRO
          </div>
        )}
      </div>

      {/* Stats */}
      <h4 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide mb-2`}>Usage This Month</h4>
      <div className={`grid grid-cols-2 gap-2 mb-4`}>
        <div className={`p-4 rounded-xl ${theme.bgSecondary}`}>
          <p className={`text-2xl font-bold ${theme.text}`}>{queriesUsed}</p>
          <p className={`text-xs ${theme.textMuted}`}>Queries used</p>
        </div>
        <div className={`p-4 rounded-xl ${theme.bgSecondary}`}>
          <p className={`text-2xl font-bold ${theme.text}`}>{maxQueries - queriesUsed}</p>
          <p className={`text-xs ${theme.textMuted}`}>Remaining</p>
        </div>
      </div>

      {/* Plan */}
      <h4 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide mb-2`}>Current Plan</h4>
      <div className={`p-4 rounded-xl ${theme.bgSecondary} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold ${theme.text}`}>{user?.isPro ? 'Pro' : 'Free'}</span>
          <span className={`text-sm ${theme.textSecondary}`}>{user?.isPro ? '$5/mo' : '$0/mo'}</span>
        </div>
        <p className={`text-xs ${theme.textMuted}`}>
          {user?.isPro ? '60 queries per month' : '15 queries per month'}
        </p>
      </div>

      {!user?.isPro && (
        <button
          onClick={() => setShowUpgradeModal(true)}
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all`}
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  )

  // Upgrade Modal
  const UpgradeModal = () => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-[320px] ${theme.bgSolid} rounded-2xl p-6 shadow-2xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white text-xs font-bold flex items-center gap-1`}>
            <CrownIcon />
            PRO
          </div>
          <button onClick={() => setShowUpgradeModal(false)} className={theme.textMuted}>
            <CloseIcon />
          </button>
        </div>

        <h3 className={`text-xl font-bold ${theme.text} mb-2`}>Upgrade to Pro</h3>
        <p className={`text-sm ${theme.textSecondary} mb-4`}>
          Get 4x more queries and unlock your full potential.
        </p>

        <div className={`p-4 rounded-xl ${theme.bgSecondary} mb-4`}>
          <div className="flex items-baseline gap-1 mb-3">
            <span className={`text-3xl font-bold ${theme.text}`}>$5</span>
            <span className={`text-sm ${theme.textMuted}`}>/month</span>
          </div>
          <ul className="space-y-2">
            <li className={`flex items-center gap-2 text-sm ${theme.text}`}>
              <span className="text-green-500">✓</span>
              60 queries per month
            </li>
            <li className={`flex items-center gap-2 text-sm ${theme.text}`}>
              <span className="text-green-500">✓</span>
              Priority AI responses
            </li>
            <li className={`flex items-center gap-2 text-sm ${theme.text}`}>
              <span className="text-green-500">✓</span>
              Advanced search filters
            </li>
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all`}
        >
          Upgrade Now
        </button>
        <button
          onClick={() => setShowUpgradeModal(false)}
          className={`w-full py-2 mt-2 text-sm ${theme.textSecondary}`}
        >
          Maybe later
        </button>
      </div>
    </div>
  )

  // Render current view
  const renderView = () => {
    switch (view) {
      case VIEWS.WELCOME: return <WelcomeView />
      case VIEWS.AUTH: return <AuthView />
      case VIEWS.GMAIL_CONNECT: return <GmailConnectView />
      case VIEWS.CHAT: return <ChatView />
      case VIEWS.SETTINGS: return <SettingsView />
      case VIEWS.ACCOUNT: return <AccountView />
      default: return <WelcomeView />
    }
  }

  return (
    <div className={`w-full h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-100'} relative`}>
      {/* Launch button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center`}
      >
        <SparkleIcon size={22} />
      </button>

      {isOpen && (
        <div
          className={`fixed right-5 top-5 bottom-5 w-[380px] ${theme.bg} backdrop-blur-xl rounded-2xl shadow-2xl border ${theme.border} flex flex-col overflow-hidden animate-slide-in`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white`}>
                <SparkleIcon size={18} />
              </div>
              <div>
                <h1 className={`text-sm font-semibold ${theme.text}`}>Spotlight</h1>
                <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wide`}>Email Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <>
                  <button
                    onClick={() => setView(VIEWS.SETTINGS)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${theme.textMuted} ${theme.hover} transition-colors`}
                  >
                    <SettingsIcon />
                  </button>
                  <button
                    onClick={() => setView(VIEWS.ACCOUNT)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${theme.textMuted} ${theme.hover} transition-colors`}
                  >
                    <UserIcon />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${theme.textMuted} ${theme.hover} transition-colors`}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {renderView()}

          {showUpgradeModal && <UpgradeModal />}
        </div>
      )}
    </div>
  )
}
