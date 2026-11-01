import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'
import { Navigate } from 'react-router'
import { useNavigate } from "react-router";
import { setCurrentChatId } from '../chat.slice.js'

const recentChats = [
  { id: 1, title: 'Using createBrowserRouter' },
  { id: 2, title: 'Flex Grow And Basis' },
  { id: 3, title: 'Detect Expressions React FaceApi' },
  { id: 4, title: 'Socket.IO Broadcast Methods' },
  { id: 5, title: 'Resume Job Search Analysis' },
]

const Dashboard = () => {
  const dispatch = useDispatch()
  const chat = useChat()
  const { handleLogout } = useAuth()

  const { chats } = useSelector((state)=> state.chat)
  const { currentChatId } = useSelector((state)=> state.chat)
  const { user } = useSelector((state) => state.auth)
  const [input, setInput] = useState('')
  const [activeChat, setActiveChat] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userCardRef = useRef(null)
  const navigate = useNavigate()


  useEffect(() => {
    chat.intializeSocketConnection()
    chat.handleGetchats()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return
    const handler = () => setOpenMenuId(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openMenuId])

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return
    const handler = (e) => {
      if (userCardRef.current && !userCardRef.current.contains(e.target))
        setShowUserMenu(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showUserMenu])

  const handleSend = async() => {
    if (!input.trim()) return
    setInput('')
    const wasNewChat = !currentChatId
    
    const newChatId = await chat.handleSendMessage({message: input, chatId: currentChatId})
    if (wasNewChat) {
    setActiveChat(newChatId)  // ← new chat ko sidebar me highlight karo
  }
  
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const openChat = (id) => {
    setActiveChat(id)
    chat.handleOpenChat(id, chats)
  } 

  const logoutUser = async() => {
    await handleLogout()
    navigate("/login")
  }

  const handleNewChat = () => {
    chat.handleStartNewChat()
    setActiveChat(null)
    setInput('')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col w-[280px] min-w-[220px] h-full py-4 px-3"
        style={{ background: '#f7f7f8', borderRight: '1px solid #e5e5e5' }}
      >
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center justify-start w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors border shadow-xs mb-3 hover:bg-[#ececec] cursor-pointer"
          style={{
            background: '#ffffff',
            borderColor: '#e5e5e5',
            color: '#202123',
          }}
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New chat</span>
          </div>
        </button>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto mt-2">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2 px-2"
            style={{ color: '#6b6b6b' }}
          >
            Recent chats
          </p>
          <ul className="space-y-0.5">
            {Object.values(chats).map((chatItem) => ( // used Object.values(chats) to map an object
              <li key={chatItem.id} className="relative group">
                {/* Row */}
                <div
                  className="flex items-center justify-between rounded-lg transition-colors duration-150 pr-1"
                  style={{
                    background: activeChat === chatItem.id ? '#ececec' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeChat !== chatItem.id)
                      e.currentTarget.style.background = '#ececec'
                  }}
                  onMouseLeave={(e) => {
                    if (activeChat !== chatItem.id)
                      e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Chat title button */}
                  <button
                    onClick={() => openChat(chatItem.id)}
                    className="flex-1 text-left px-2 py-2 text-sm truncate"
                    style={{ color: activeChat === chatItem.id ? '#202123' : '#353740' }}
                  >
                    {chatItem.title}
                  </button>

                  {/* 3-dots button — visible on hover or when menu open */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === chatItem.id ? null : chatItem.id)
                    }}
                    className={`shrink-0 p-1 rounded-md transition-opacity duration-100 ${
                      openMenuId === chatItem.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{ color: '#6b6b6b' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>
                </div>

                {/* Dropdown menu */}
                {openMenuId === chatItem.id && (
                  <div
                    className="absolute right-0 top-8 z-50 w-36 rounded-xl py-1 shadow-lg border"
                    style={{ background: '#ffffff', borderColor: '#e5e5e5' }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        chat.handleDeleteChat(chatItem.id)
                        handleNewChat()                                          
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#fff0ee] rounded-lg"
                      style={{ color: '#e53e3e' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                      Delete chat
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ── User Card ── */}
        <div ref={userCardRef} className="relative mt-4">

          {/* Logout popup — appears above */}
          {showUserMenu && (
            <div
              className="absolute bottom-full mb-2 left-0 right-0 rounded-xl py-1 shadow-md border overflow-hidden"
              style={{ background: '#ffffff', borderColor: '#e5e5e5' }}
            >
              <button
                onClick={logoutUser}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#ececec]"
                style={{ color: '#202123' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          )}

          {/* User row */}
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors duration-150 hover:bg-[#ececec]"
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold shrink-0"
              style={{ background: '#D97757' }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Name + email */}
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-medium truncate" style={{ color: '#202123' }}>
                {user?.username || 'User'}
              </span>
              <span className="text-xs truncate" style={{ color: '#8e8ea0' }}>
                {user?.email || ''}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="flex flex-col flex-1 h-full overflow-hidden bg-white">

        {/* Messages */}
        <div className="message-container flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-6">
            {!currentChatId && (
              <div className="flex items-center justify-center mt-32">
                <p className="text-gray-400 text-2xl">What do you want to know?</p>
              </div>
            )}
            {chats[currentChatId]?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <span
                    className="px-4 py-2 rounded-2xl text-sm max-w-[75%] leading-relaxed"
                    style={{ background: '#f4f4f4', color: '#0d0d0d' }}
                  >
                    {msg.content}
                  </span>
                ) : (
                  <div className="text-sm leading-relaxed text-gray-800 w-full min-w-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-4 pb-4 pt-2 flex justify-center">
          <div
            className="w-full max-w-2xl flex items-center gap-2 rounded-2xl border px-4 py-3"
                        style={{
                borderColor: isFocused ? '#D97757' : '#e5e5e5',
                background: '#ffffff',
                boxShadow: isFocused ? '0 0 0 0.9px #D97757' : 'none',
              }}
          >
            {/* Plus icon */}
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
              +
            </button>

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask Perplexity"
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 text-gray-800"
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-opacity"
              style={{ background: '#D97757', opacity: input.trim() ? 1 : 0.4 }}
              disabled={!input.trim()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
