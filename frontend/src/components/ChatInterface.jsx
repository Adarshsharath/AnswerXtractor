import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Send, FileText, Sparkles, Loader2, Copy, Brain } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'

const ChatInterface = ({ chat, document, onNewChat, onOpenStudyLab }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chat) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    if (!chat) return

    setLoadingMessages(true)
    try {
      const response = await axios.get(`/api/chats/${chat.id}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || !chat) return

    setLoading(true)
    const userMessage = inputMessage
    setInputMessage('')

    try {
      const response = await axios.post(`/api/chats/${chat.id}/messages`, {
        message: userMessage
      })

      setMessages([...messages, response.data.user_message, response.data.ai_message])
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAskWithoutContext = async (userMessage) => {
    if (!chat || loading) return

    setLoading(true)
    try {
      const response = await axios.post(`/api/chats/${chat.id}/messages`, {
        message: userMessage,
        no_context: true
      })

      setMessages([...messages, response.data.ai_message])
    } catch (error) {
      console.error('Error getting general response:', error)
      alert('Error getting general response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="w-24 h-24 bg-gradient-to-br from-primary-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30 animate-pulse-glow"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Ready to Explore?
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-medium leading-relaxed">
            Upload your documents and let <span className="text-primary-400 font-bold">AnswerXtractor</span> help you find the answers you need in seconds.
          </p>
          <button
            onClick={() => onNewChat(null)}
            className="group bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/25 active-press hover-lift flex items-center justify-center mx-auto space-x-2"
          >
            <span>Initialize Engine</span>
            <Sparkles className="w-5 h-5 group-hover:animate-spin-slow transition-transform" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/5 bg-gray-900/40 backdrop-blur-2xl sticky top-0 z-10"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center shadow-inner"
            >
              <FileText className="w-6 h-6 text-primary-400" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-white font-black leading-none truncate max-w-[200px] sm:max-w-md">{document?.filename || 'Untitled Document'}</h3>
              <p className="text-[10px] text-gray-500 mt-1.5 font-bold uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                {document?.type && document?.size
                  ? `${document.type.toUpperCase()} • ${Math.round(document.size / 1024)} KB`
                  : 'Document Context Active'}
              </p>
            </div>
          </div>
          {document && (
            <button
              onClick={onOpenStudyLab}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600/10 to-blue-600/10 hover:from-primary-600/20 hover:to-blue-600/20 text-primary-400 border border-primary-500/30 rounded-2xl transition-all font-black text-xs tracking-widest uppercase group hover-glow active-press hover-lift"
            >
              <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Study Lab</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {loadingMessages ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full space-y-4"
            >
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Synchronizing Knowledge</p>
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                <Sparkles className="w-10 h-10 text-gray-700" />
              </div>
              <p className="text-gray-500 font-medium text-lg max-w-xs">
                Ask your first question to begin the extraction process.
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] group`}>
                  <div
                    className={`relative ${message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white shadow-xl shadow-primary-500/10'
                      : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-100 shadow-2xl'
                      } rounded-[1.5rem] px-6 py-4 transition-all duration-300 hover:shadow-2xl hover:border-white/20`}
                  >
                    <div className="markdown-content prose prose-invert prose-sm max-w-none">
                      {message.sender === 'user' ? (
                        <p className="whitespace-pre-wrap font-medium">{message.message}</p>
                      ) : (
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <div className="relative group/code my-4 overflow-hidden rounded-xl border border-white/10">
                                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{match[1]}</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                      className="p-1 px-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-all transition-all duration-200 uppercase tracking-widest border border-white/5 shadow-sm"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    className="!m-0 !bg-transparent !p-4 !text-xs"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-primary-300 font-mono text-xs" {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {message.message}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-2.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                      {message.sender === 'user' ? 'YOU' : 'SYSTEM'}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="text-[10px] text-gray-600 font-bold">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'ai' && (
                      <button
                        onClick={() => {
                          const prevUserMsg = [...messages].reverse().find(m => m.sender === 'user' && m.timestamp <= message.timestamp);
                          if (prevUserMsg) handleAskWithoutContext(prevUserMsg.message);
                        }}
                        className="text-[10px] flex items-center space-x-1.5 text-primary-400 hover:text-primary-300 transition-all uppercase tracking-widest font-black"
                      >
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <Sparkles className="w-3 h-3" />
                        <span>Force AI Refinement</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 shadow-lg flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></motion.div>
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Generating Answer</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="relative group bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 pr-4 shadow-2xl transition-all duration-300 focus-within:border-primary-500/30 focus-within:shadow-primary-500/10 focus-within:bg-gray-900/80"
          >
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative pl-4 pb-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                  placeholder="Query document context..."
                  className="w-full py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-gray-600 resize-none font-medium leading-relaxed"
                  rows="1"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                  disabled={loading}
                />
              </div>
              <div className="pb-2">
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white p-3.5 rounded-2xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-primary-500/25 active-press hover-lift flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Shortcuts indicator */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500">
              <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                  <span className="text-primary-400">Enter</span> to send <span className="mx-2 text-gray-700">•</span> <span className="text-primary-400">Shift+Enter</span> for new line
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatInterface
