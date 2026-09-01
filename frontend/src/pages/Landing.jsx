import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Sparkles, Moon, Sun, ArrowRight, User, Check, Layers, Cpu, Search, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react'
import useAuthStore from '../store/authStore'
import Logo from '../components/Logo'

export default function Landing() {
  const { user } = useAuthStore()
  const [darkMode, setDarkMode] = useState(false)
  const dashboardPath = user?.role === 'employer' ? '/employer' : '/seeker'

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#08080C] text-white' : 'bg-gray-950 text-white'} overflow-hidden font-sans selection:bg-purple-500/30`}>

      {/* Main Split Background Container */}
      <div className="relative min-h-screen flex flex-col">

        {/* Background Split Screen Effect */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 pointer-events-none z-0">
          {/* Left Side: Soft Off-White Light Tint */}
          <div className="bg-[#F4F4FA] border-r border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-200/50 rounded-full blur-[130px]" />
          </div>
          {/* Right Side: Deep Obsidian Dark Theme */}
          <div className="bg-[#090910] relative overflow-hidden">
            <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[140px]" />
          </div>
        </div>

        {/* Navbar Header (Positioned across split theme) */}
        <nav className="relative z-30 px-6 lg:px-12 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Logo size="md" variant={darkMode ? 'dark' : 'light'} />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-bold tracking-wide uppercase">
            <a href="#home" className="text-gray-900 hover:text-purple-600 transition-colors">Home</a>
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
            <a href="#integrations" className="text-gray-400 hover:text-purple-400 transition-colors">Integrations</a>
            <a href="#pricing" className="text-gray-400 hover:text-purple-400 transition-colors">Pricing</a>
            <a href="#docs" className="text-gray-400 hover:text-purple-400 transition-colors">Docs</a>
            <a href="#uikit" className="text-gray-400 hover:text-purple-400 transition-colors">UI Kit</a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 flex items-center justify-center text-gray-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-purple-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-900/10 rounded-xl border border-gray-300/30">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">{user.full_name}</span>
                </div>
                <Link to={dashboardPath} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/30 transition-all">
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Copy & CTA Section */}
        <section id="home" className="relative z-20 max-w-5xl mx-auto px-6 pt-12 pb-12 text-center">

          {/* Product Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 text-xs font-black uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>AI-POWERED CAREER MATCHING</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-gray-900">
            Boost Your Recruitment
            <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">ResumeX</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Transform candidate matching with ResumeX. Combine powerful AI resume parsing, vector semantic search, and seamless job intelligence to stay focused and achieve more.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to={user ? dashboardPath : "/register"}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-purple-600/35 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="px-7 py-3.5 bg-gray-900/90 hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              See how it works
            </a>
          </div>

          {/* Desktop Application Window Mockup (Floating macOS window frame spanning split screen) */}
          <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 bg-gradient-to-b from-gray-900 to-gray-950 text-left">
            
            {/* macOS Titlebar Header */}
            <div className="bg-[#161622] px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono font-bold text-white/50">ResumeX Desktop — AI Matcher Engine</span>
              </div>
              <div className="text-[11px] font-mono text-white/40 hidden sm:block">
                Mon Jun 5 9:41 AM
              </div>
            </div>

            {/* Split macOS Application Window Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[380px]">
              
              {/* Sidebar Inside Window (4 cols) */}
              <div className="md:col-span-4 bg-[#11111C] p-5 border-r border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-white">All ∨ Today</span>
                  <span className="text-xs font-mono text-purple-400 font-bold">2/9 done</span>
                </div>

                <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                  <div className="text-xs font-bold text-white mb-1">Resume Parsing</div>
                  <div className="text-lg font-black text-purple-400 font-mono">03:59:57</div>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-white/5 rounded-lg text-xs font-medium text-white/80 flex items-center justify-between">
                    <span>NLP Skill Extraction</span>
                    <span className="text-emerald-400 font-mono">Completed</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg text-xs font-medium text-white/80 flex items-center justify-between">
                    <span>Vector Embedding Match</span>
                    <span className="text-purple-400 font-mono">92% Match</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg text-xs font-medium text-white/80 flex items-center justify-between">
                    <span>FastAPI Pipeline Sync</span>
                    <span className="text-cyan-400 font-mono">Active</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area Inside Window (8 cols) */}
              <div className="md:col-span-8 bg-[#0D0D15] p-6 space-y-6">
                
                {/* Internal App Navigation Bar */}
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Logo size="sm" clickable={false} />
                  </div>
                  <div className="flex gap-4">
                    <span className="text-purple-400 font-bold">Works</span>
                    <span>Blog</span>
                    <span>Features</span>
                    <span>Pricing</span>
                  </div>
                </div>

                {/* Main Card Inside Preview Window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-md text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                      Customize Everything
                    </span>
                    <h4 className="text-lg font-black text-white leading-snug">
                      Versatile AI Solution For Your Match Needs 🖐️
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Enthusiastically empower client-centric materials for an expanded array of candidate matching potentialities.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-purple-300 font-mono uppercase">Matching Efficiency</div>
                      <div className="text-2xl font-black text-white my-1">$984,556.34</div>
                      <div className="text-xs text-white/40">Roberto Karlez • Enterprise Hiring</div>
                    </div>
                    <div className="flex gap-1.5 mt-4">
                      {['Python', 'FastAPI', 'PostgreSQL', 'Redis'].map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/80 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* Feature Highlights Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>ResumeX Intelligence Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Enterprise-Grade AI Resume Matcher
          </h2>
          <p className="text-white/60 text-base">
            Engineered with FastAPI, vector databases, machine learning embeddings, and cloud microservices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: 'Automated Resume Parsing',
              desc: 'Extract key skills, experience years, and candidate qualifications using OpenAI LLM engines and NLP pipelines.'
            },
            {
              icon: Search,
              title: 'Vector Cosine Matching',
              desc: 'Compute precise high-dimensional vector similarity scores between job requirements and candidate resumes.'
            },
            {
              icon: ShieldCheck,
              title: 'Cloud-Ready Architecture',
              desc: 'Built for scalable deployment with Docker, Kubernetes, AWS, PostgreSQL, and Redis caching.'
            }
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 bg-[#060609]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" clickable={false} />
          <div className="text-white/40 text-xs font-medium text-center">
            © 2026 ResumeX • AI-Powered Resume Matcher • Built from Commit to Production by Rishabh
          </div>
          <div className="text-white/30 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> ResumeX Engine Active
          </div>
        </div>
      </footer>

    </div>
  )
}