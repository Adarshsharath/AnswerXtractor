import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquarePlus,
  FileText,
  History,
  LogOut,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'

const Sidebar = ({ documents, chats, currentChat, onNewChat, onSelectChat, onDeleteChat }) => {
  const { logout } = useAuth()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(!document.body.classList.contains('light'))

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.body.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      document.body.classList.add('light')
      setIsDarkMode(false)
    }
  }, [])

  const handleNewChatClick = () => {
    if (documents.length === 0) return
    if (documents.length === 1) {
      onNewChat(documents[0].id)
    } else {
      setSelectedDocument(documents[0].id)
      onNewChat(documents[0].id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="bg-gray-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20 overflow-hidden shadow-2xl transition-colors duration-500"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3 overflow-hidden"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20 animate-pulse-glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-shrink-0">
                  <h2 className="font-bold text-white tracking-tight">AnswerXtractor</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI Assistant</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-white active-press"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChatClick}
          className="w-full bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-primary-500/20 hover-glow active-press hover-lift"
        >
          <MessageSquarePlus className="w-5 h-5" />
          {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
        </button>
      </div>

      {/* Navigation */}
      <div className="px-4 py-2">
        <Link
          to="/dashboard/documents"
          className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 border ${location.pathname === '/dashboard/documents'
              ? 'bg-primary-500/10 border-primary-500/30 text-primary-400 shadow-lg shadow-primary-500/5'
              : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
            } active-press`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-3 font-medium">Documents</span>
              <span className="ml-auto bg-white/10 text-gray-400 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                {documents.length}
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
        {!isCollapsed && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-4">
              Recent Activity
            </h3>
            <div className="space-y-2.5">
              {chats.length === 0 ? (
                <p className="text-gray-600 text-xs px-4 py-2 italic font-medium">No history found</p>
              ) : (
                chats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    variants={itemVariants}
                    className={`group relative px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 border ${currentChat?.id === chat.id
                        ? 'bg-white/10 border-white/10 text-white shadow-xl shadow-black/50'
                        : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/5'
                      } hover-glow active-press`}
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">{chat.preview}</p>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium truncate uppercase tracking-tight">{chat.document_name}</p>
                        <p className="text-[10px] text-gray-600 mt-1.5 flex items-center font-bold">
                          <History className="w-3 h-3 mr-1 opacity-50" />
                          {formatDate(chat.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteChat(chat.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all text-red-400/50 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Theme Toggle & Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-2xl transition-all duration-300 active-press"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && <span className="font-bold text-xs tracking-tight">{isDarkMode ? 'LIGHT THEME' : 'DARK THEME'}</span>}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 active-press"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-bold text-xs tracking-tight">SIGNOUT</span>}
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar
