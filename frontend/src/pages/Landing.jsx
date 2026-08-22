import { Link } from 'react-router-dom'
import { Briefcase, Upload, Zap, Target, Users, TrendingUp } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold">Resume<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          AI-Powered Resume Matching
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Match the Right Talent<br />
          <span className="text-indigo-600">with the Right Job</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Upload your resume and instantly see how well you match any job.
          Our ML model analyzes skills, experience, and semantic similarity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register?role=seeker" className="btn-primary text-base px-6 py-3">
            Find Jobs as Seeker
          </Link>
          <Link to="/register?role=employer" className="btn-secondary text-base px-6 py-3">
            Hire as Employer
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume. Our AI extracts skills and experience automatically.' },
              { icon: Target, title: 'Get Match Score', desc: 'See your match score for any job. Find out which skills you have and which you are missing.' },
              { icon: TrendingUp, title: 'Apply & Track', desc: 'Apply to jobs with one click and track all your applications in one place.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '95%', label: 'Match Accuracy' },
              { value: '<1s', label: 'Response Time' },
              { value: '100%', label: 'AI Powered' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold text-indigo-600 mb-2">{value}</div>
                <div className="text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center gap-2 justify-center">
          <Briefcase className="h-4 w-4 text-indigo-600" />
          <span>ResumeAI © 2026</span>
        </div>
      </footer>
    </div>
  )
}