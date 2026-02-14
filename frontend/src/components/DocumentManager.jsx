import React, { useState } from 'react'
import axios from 'axios'
import { Upload, FileText, Trash2, Calendar, CheckCircle, AlertCircle, X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DocumentManager = ({ documents, onDocumentUploaded, onDeleteDocument, onSelectDocument }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain']

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|pptx|txt)$/i)) {
      setError('Only PDF, DOCX, PPTX, and TXT files are supported')
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress({ filename: file.name, status: 'uploading' })

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadProgress({ filename: file.name, status: 'success' })
      onDocumentUploaded()

      setTimeout(() => {
        setUploadProgress(null)
      }, 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading document')
      setUploadProgress({ filename: file.name, status: 'error' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return <FileText className="w-6 h-6 text-primary-400" />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="h-full bg-gray-950 overflow-y-auto custom-scrollbar relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -ml-96 -mt-96 pointer-events-none"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 py-12 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Digital Archive
          </h1>
          <p className="text-gray-500 text-lg font-medium">Powering your knowledge with AI-driven document analysis</p>
        </motion.div>

        {/* Upload Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="glass-morphism rounded-[2.5rem] p-4 bg-white/5 border border-white/10 shadow-3xl">
            <label
              htmlFor="file-upload"
              className={`relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-16 cursor-pointer transition-all duration-500 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500/40 hover:bg-white/5 group'
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>

              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={uploading ? { rotate: 360 } : {}}
                  transition={uploading ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
                  className={`w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Upload className="w-10 h-10 text-white" />
                </motion.div>
                <p className="text-2xl font-black text-white mb-3 tracking-tight">
                  {uploading ? 'INGESTING CONTENT...' : 'UPLOAD MANUSCRIPT'}
                </p>
                <div className="flex items-center space-x-3 text-gray-400 font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Info className="w-3.5 h-3.5 text-primary-400" />
                  <span>PDF, DOCX, PPTX, TXT • MAX 16MB</span>
                </div>
              </div>

              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>

            <AnimatePresence>
              {uploadProgress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className={`p-5 rounded-2xl flex items-center justify-between shadow-lg ${uploadProgress.status === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                      uploadProgress.status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                        'bg-primary-500/10 border border-primary-500/30'
                    }`}>
                    <div className="flex items-center space-x-4">
                      {uploadProgress.status === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : uploadProgress.status === 'error' ? (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      ) : (
                        <div className="w-6 h-6 border-3 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <div>
                        <p className={`text-sm font-black uppercase tracking-widest ${uploadProgress.status === 'success' ? 'text-emerald-400' :
                            uploadProgress.status === 'error' ? 'text-red-400' :
                              'text-primary-400'
                          }`}>
                          {uploadProgress.status === 'success' ? 'Synchronized: ' :
                            uploadProgress.status === 'error' ? 'Failure: ' :
                              'Ingesting: '}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{uploadProgress.filename}</p>
                      </div>
                    </div>
                    {uploadProgress.status !== 'uploading' && (
                      <button
                        onClick={() => setUploadProgress(null)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all active-press"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start justify-between shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-red-400 uppercase tracking-widest">Operation Blocked</p>
                      <p className="text-xs text-red-500/70 font-medium mt-1">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="p-2 hover:bg-red-500/10 rounded-xl transition-all active-press"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
              Active Knowledge Base
              <span className="ml-4 bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full text-xs font-black">
                {documents.length} FILES
              </span>
            </h2>
          </div>

          {documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 rounded-[2.5rem] border border-white/5 p-20 text-center shadow-inner"
            >
              <FileText className="w-20 h-20 text-gray-800 mx-auto mb-6" />
              <p className="text-gray-500 text-xl font-bold italic tracking-tight">Your digital expansion starts here.</p>
              <p className="text-gray-600 mt-2 font-medium">Upload a file to begin AI augmentation.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 cursor-pointer group hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-primary-500/5"
                  onClick={() => onSelectDocument(doc)}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-blue-500/10 border border-white/10 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all group-hover:border-primary-500/30">
                      {getFileIcon(doc.filename)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Are you sure you want to delete this document?')) {
                          onDeleteDocument(doc.id)
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all duration-300 active-press"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 truncate leading-tight group-hover:text-primary-400 transition-colors" title={doc.filename}>
                    {doc.filename}
                  </h3>

                  <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 mr-2 opacity-50" />
                    {formatDate(doc.uploaded_at)}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-600 tracking-tighter uppercase">{doc.type || 'DOCUMENT'}</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-bold text-emerald-500/70 uppercase">Ready</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DocumentManager
