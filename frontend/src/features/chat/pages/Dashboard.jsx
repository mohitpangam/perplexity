import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from '../hooks/useChat'

const recentChats = [
  { id: 1, title: 'Using createBrowserRouter' },
  { id: 2, title: 'Flex Grow And Basis' },
  { id: 3, title: 'Detect Expressions React FaceApi' },
  { id: 4, title: 'Socket.IO Broadcast Methods' },
  { id: 5, title: 'Resume Job Search Analysis' },
]

const Dashboard = () => {
  const chat = useChat()

  const { chats } = useSelector((state)=> state.chat)
  const { currentChatId } = useSelector((state)=> state.chat)
  const { user } = useSelector((state) => state.auth)
  const [input, setInput] = useState('')
  const [activeChat, setActiveChat] = useState(null)
  const [isFocused, setIsFocused] = useState(false)


  useEffect(() => {
    chat.intializeSocketConnection()
    chat.handleGetchats()
  }, [])

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col w-[280px] min-w-[220px] h-full py-4 px-3"
        style={{ background: '#f7f7f8', borderRight: '1px solid #e5e5e5' }}
      >
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
              <li key={chatItem.id}>
                <button
                  onClick={() => openChat(chatItem.id)}
                  className="w-full text-left px-2 py-2 rounded-lg text-sm truncate transition-colors duration-150"
                  style={{
                    color: activeChat === chatItem.id ? '#202123' : '#353740',
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
                  {chatItem.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── User Card ── */}
        <div
          className="flex items-center gap-3 px-2 py-2.5 rounded-xl mt-4 cursor-pointer transition-colors duration-150 hover:bg-[#ececec]"
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold shrink-0"
            style={{ background: '#D97757' }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Name + email */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate" style={{ color: '#202123' }}>
              {user?.username || 'User'}
            </span>
            <span className="text-xs truncate" style={{ color: '#8e8ea0' }}>
              {user?.email || ''}
            </span>
          </div>
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
