import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Brain,
    Layers,
    HelpCircle,
    Network,
    CheckCircle2,
    XCircle,
    Trophy,
    Loader2,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import mermaid from 'mermaid'

// Initialize Mermaid with custom beautiful theme
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#fff',
        primaryBorderColor: '#4f46e5',
        lineColor: '#8b5cf6',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#06b6d4',
        background: '#1e1b4b',
        mainBkg: '#312e81',
        secondBkg: '#4c1d95',
        tertiaryBkg: '#164e63',
        nodeBorder: '#6366f1',
        clusterBkg: '#1e293b',
        clusterBorder: '#475569',
        titleColor: '#f8fafc',
        edgeLabelBackground: '#1e293b',
        nodeTextColor: '#f8fafc',
        fontSize: '16px'
    }
})

const StudyTools = ({ document, onClose }) => {
    const [activeTab, setActiveTab] = useState('flashcards')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchStudyMaterial(activeTab)
    }, [activeTab])

    const fetchStudyMaterial = async (type) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`/api/documents/${document?.id}/study-tools`, { type })
            console.log('Study tools API response:', response.data)
            setData(response.data)
        } catch (err) {
            console.error('Error fetching study tools:', err)
            setError(err.response?.data?.message || 'Failed to generate study material. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-gray-950/90 backdrop-blur-xl">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-6xl h-[90vh] glass-morphism rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5 shadow-lg relative z-10">
                    <div className="flex items-center space-x-5">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            className="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary-500/20"
                        >
                            <Brain className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Study Lab</h2>
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                                {document?.filename || 'Untitled Corpus'}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 shadow-inner backdrop-blur-3xl">
                        <TabButton
                            active={activeTab === 'flashcards'}
                            onClick={() => setActiveTab('flashcards')}
                            icon={<Layers className="w-4 h-4" />}
                            label="Key Cards"
                        />
                        <TabButton
                            active={activeTab === 'quiz'}
                            onClick={() => setActiveTab('quiz')}
                            icon={<HelpCircle className="w-4 h-4" />}
                            label="Assessment"
                        />
                        <TabButton
                            active={activeTab === 'mindmap'}
                            onClick={() => setActiveTab('mindmap')}
                            icon={<Network className="w-4 h-4" />}
                            label="Nexus Map"
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-500/20 rounded-2xl transition-all group active-press"
                    >
                        <X className="w-6 h-6 text-gray-500 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden flex bg-white/5 border-b border-white/5 p-2 overflow-x-auto no-scrollbar">
                    <TabButton
                        active={activeTab === 'flashcards'}
                        onClick={() => setActiveTab('flashcards')}
                        icon={<Layers className="w-4 h-4" />}
                        label="Cards"
                    />
                    <TabButton
                        active={activeTab === 'quiz'}
                        onClick={() => setActiveTab('quiz')}
                        icon={<HelpCircle className="w-4 h-4" />}
                        label="Quiz"
                    />
                    <TabButton
                        active={activeTab === 'mindmap'}
                        onClick={() => setActiveTab('mindmap')}
                        icon={<Network className="w-4 h-4" />}
                        label="Map"
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-gray-950/20">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                                    <Sparkles className="w-8 h-8 text-primary-400 absolute inset-0 m-auto animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-xl font-black uppercase tracking-widest">Architecting {activeTab}</p>
                                    <p className="text-gray-500 text-xs font-bold uppercase mt-2 tracking-[0.3em]">AI Synthesis in progress</p>
                                </div>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full p-8 max-w-md mx-auto text-center"
                            >
                                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-xl shadow-red-500/10">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Synthesis Error</h3>
                                <p className="text-gray-500 font-medium mb-8 leading-relaxed">{error}</p>
                                <button
                                    onClick={() => fetchStudyMaterial(activeTab)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-sm font-black uppercase tracking-widest border border-white/10 active-press hover-lift flex items-center space-x-3"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Retry Analysis</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="h-full"
                            >
                                {activeTab === 'flashcards' && data && (
                                    <FlashcardsView cards={data} />
                                )}
                                {activeTab === 'quiz' && data && (
                                    <QuizView questions={data} />
                                )}
                                {activeTab === 'mindmap' && data && (
                                    <MindMapView structure={data} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-3 px-6 py-3 rounded-[1.25rem] transition-all duration-300 font-black text-xs uppercase tracking-widest ${active
            ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-xl shadow-primary-500/20'
            : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
)

const FlashcardsView = ({ cards }) => {
    const [index, setIndex] = useState(0)

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
        return (
            <div className="h-full flex items-center justify-center px-8">
                <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
                    <Layers className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No key cards synthesized</p>
                </div>
            </div>
        )
    }

    const handleNext = () => setIndex((prev) => (prev + 1) % cards.length)
    const handlePrev = () => setIndex((prev) => (prev - 1 + cards.length) % cards.length)

    const currentCard = cards[index]
    const colorSchemes = [
        { from: 'from-blue-600/20', to: 'to-indigo-600/20', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
        { from: 'from-violet-600/20', to: 'to-purple-600/20', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
        { from: 'from-emerald-600/20', to: 'to-cyan-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
        { from: 'from-amber-600/20', to: 'to-orange-600/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' }
    ]
    const scheme = colorSchemes[index % colorSchemes.length]

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-12">
            <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className={`relative w-full max-w-3xl bg-gradient-to-br ${scheme.from} ${scheme.to} backdrop-blur-2xl border ${scheme.border} rounded-[3rem] p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ${scheme.glow} cursor-default`}
            >
                <div className="absolute top-8 right-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mt-1">CORE CONCEPT</div>

                <div className={`w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center mb-8 border border-white/10 shadow-inner`}>
                    <Layers className={`w-8 h-8 ${scheme.text}`} />
                </div>

                <div className="space-y-6 relative z-10">
                    <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1]">
                        {currentCard.title}
                    </h2>
                    <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
                    <p className="text-xl text-gray-300 font-medium leading-relaxed">
                        {currentCard.description}
                    </p>
                </div>

                <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-white/5 rounded-tr-[5rem] blur-2xl opacity-20"></div>
            </motion.div>

            <div className="flex items-center space-x-10 p-4 bg-white/5 rounded-[2rem] border border-white/5 shadow-2xl">
                <button onClick={handlePrev} className="p-4 hover:bg-white/10 rounded-2xl transition-all text-white active-press hover-lift">
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <div className="flex flex-col items-center min-w-[120px]">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-3">{index + 1} / {cards.length}</span>
                    <div className="flex space-x-1.5">
                        {cards.map((_, i) => (
                            <motion.div
                                key={i}
                                initial={false}
                                animate={{ width: i === index ? 24 : 6, opacity: i === index ? 1 : 0.2 }}
                                className={`h-1.5 rounded-full bg-primary-500 shadow-sm`}
                            />
                        ))}
                    </div>
                </div>

                <button onClick={handleNext} className="p-4 hover:bg-white/10 rounded-2xl transition-all text-white active-press hover-lift">
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    )
}

const QuizView = ({ questions }) => {
    const [index, setIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
                    <HelpCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No quiz generated</p>
                </div>
            </div>
        )
    }

    const handleOptionClick = (optIndex) => {
        if (showResult) return
        setSelectedOption(optIndex)
        setShowResult(true)
        if (optIndex === questions[index].correct_index) setScore(score + 1)
    }

    const handleNext = () => {
        if (index + 1 < questions.length) {
            setIndex(index + 1); setSelectedOption(null); setShowResult(false)
        } else setIsFinished(true)
    }

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8"
            >
                <div className="relative">
                    <div className="w-32 h-32 bg-yellow-500/10 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-yellow-500/10 border border-yellow-500/20">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                    <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-400 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-5xl font-black text-white tracking-tight uppercase">Ingestion Complete</h3>
                    <p className="text-gray-500 text-lg font-medium mt-3">You demonstrated mastery over <span className="text-primary-400 font-black">{Math.round((score / questions.length) * 100)}%</span> of the material.</p>
                </div>
                <div className="flex bg-white/5 p-8 rounded-[2rem] border border-white/5 space-x-12">
                    <div className="text-center">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">SCORE</p>
                        <p className="text-4xl font-black text-white">{score}</p>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">TOTAL</p>
                        <p className="text-4xl font-black text-white">{questions.length}</p>
                    </div>
                </div>
                <button
                    onClick={() => { setIndex(0); setScore(0); setSelectedOption(null); setShowResult(false); setIsFinished(false); }}
                    className="px-12 py-5 bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-500 hover:to-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary-500/30 active-press hover-lift"
                >
                    Restart Assessment
                </button>
            </motion.div>
        )
    }

    const q = questions[index]

    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col p-8 md:p-12">
            <div className="mb-12">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-primary-400 font-black text-xs tracking-[0.3em] uppercase mb-1">EVALUATION PHASE</p>
                        <h4 className="text-gray-500 font-black text-xl uppercase tracking-widest">{index + 1} / {questions.length}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-1">CURRENT ACCURACY</p>
                        <p className="text-2xl font-black text-white">{Math.round((score / (index + (showResult ? 1 : 0))) * 100) || 0}%</p>
                    </div>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary-600 to-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                </div>
            </div>

            <motion.h3
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black text-white mb-10 leading-tight tracking-tight"
            >
                {q.question}
            </motion.h3>

            <div className="space-y-4 flex-1">
                {q.options.map((option, i) => {
                    const isCorrect = i === q.correct_index
                    const isSelected = i === selectedOption
                    let styles = "bg-white/5 border-white/5 hover:bg-white/10 text-gray-400"

                    if (showResult) {
                        if (isCorrect) styles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/5"
                        else if (isSelected) styles = "bg-red-500/10 border-red-500/30 text-red-400 shadow-xl shadow-red-500/5"
                        else styles = "opacity-20 pointer-events-none grayscale"
                    }

                    return (
                        <motion.button
                            key={i}
                            whileHover={!showResult ? { x: 10, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                            whileTap={!showResult ? { scale: 0.98 } : {}}
                            onClick={() => handleOptionClick(i)}
                            className={`w-full text-left p-6 rounded-[1.5rem] border transition-all duration-300 flex items-center justify-between group ${styles}`}
                        >
                            <span className="text-lg font-bold tracking-tight">{option}</span>
                            <AnimatePresence>
                                {showResult && isCorrect && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-6 h-6 text-emerald-500" /></motion.div>
                                )}
                                {showResult && isSelected && !isCorrect && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle className="w-6 h-6 text-red-500" /></motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    )
                })}
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={handleNext}
                        className="mt-12 w-full py-5 bg-white shadow-2xl text-black font-black uppercase text-xs tracking-[0.4em] rounded-[1.5rem] transition-all flex items-center justify-center space-x-3 hover:bg-primary-500 hover:text-white group"
                    >
                        <span>{index + 1 === questions.length ? 'Finalize Scan' : 'Next Transmission'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

const MindMapView = ({ structure }) => {
    const chartRef = useRef(null)
    const [renderError, setRenderError] = useState(null)
    const [isRendering, setIsRendering] = useState(true)

    if (!structure || typeof structure !== 'object' || !structure.name) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
                    <Network className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No mind map structure available</p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (structure) renderMermaid()
    }, [structure])

    const renderMermaid = async () => {
        if (!chartRef.current) return
        setIsRendering(true)
        setRenderError(null)

        const generateMermaidText = (node) => {
            const cleanName = (name) => {
                if (!name) return 'Unknown'
                return name.replace(/[(){}[\]"]/g, '').substring(0, 50)
            }
            let text = "mindmap\n  root((" + cleanName(node.name) + "))\n"
            const addChildren = (children, level) => {
                if (!Array.isArray(children)) return
                children.forEach(child => {
                    const indent = " ".repeat(level * 2)
                    text += indent + cleanName(child.name) + "\n"
                    if (child.children && child.children.length > 0) addChildren(child.children, level + 1)
                })
            }
            if (node.children && Array.isArray(node.children)) addChildren(node.children, 2)
            return text
        }

        try {
            const mermaidText = generateMermaidText(structure)
            const { svg } = await mermaid.render('mindmap-svg-' + Date.now(), mermaidText)
            chartRef.current.innerHTML = svg
        } catch (err) {
            setRenderError(err.message || 'Error rendering mind map')
            chartRef.current.innerHTML = `<div class="p-8 text-center text-red-400 font-bold">⚠️ Rendering Topology Failed</div>`
        } finally {
            setIsRendering(false)
        }
    }

    return (
        <div className="h-full flex flex-col p-8 md:p-12">
            <div className="mb-10 text-center">
                <h3 className="text-4xl font-black text-white tracking-tight uppercase">Nexus Topology</h3>
                <div className="flex items-center justify-center space-x-3 mt-3">
                    <span className="h-px w-8 bg-white/10"></span>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Neural Mapping of Concepts</p>
                    <span className="h-px w-8 bg-white/10"></span>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-black/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-inner relative group/map">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5 opacity-50"></div>

                {isRendering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-[3rem] z-20">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    </div>
                )}

                <div
                    ref={chartRef}
                    className="w-full h-full flex items-center justify-center mindmap-container transition-transform duration-500"
                    style={{ minHeight: '600px' }}
                ></div>

                <div className="absolute bottom-8 right-8 flex items-center space-x-2 bg-black/60 px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover/map:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Interactive Feed</span>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center">
                <div className="px-6 py-3 bg-white/5 rounded-full border border-white/5 shadow-2xl">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
                        {renderError ? 'Topology Reconstruction Required' : 'Scroll & Pan to Explorer Neural Nodes'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StudyTools
