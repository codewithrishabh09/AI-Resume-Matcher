import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle2, FileUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import FileUpload from '../../components/FileUpload'
import api from '../../api/axios'

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resumes, setResumes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resumes/')
        setResumes(data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchResumes()
  }, [])

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first')

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Resume uploaded successfully!')
      navigate('/seeker')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: '1', name: 'Upload', active: true },
    { num: '2', name: 'Analyze', active: false },
    { num: '3', name: 'Match', active: false },
    { num: '4', name: 'Results', active: false },
  ]

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Title & Subtitle */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload Resume</h1>
            <p className="text-white/50 text-sm mt-1">Upload your PDF or DOCX resume to analyze skills and run AI semantic matching</p>
          </div>
        </div>

        {/* 4-Step Process Timeline */}
        <div className="card mb-8 p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, idx) => (
              <div key={step.name} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.active
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/50 ring-4 ring-violet-500/20'
                      : 'bg-white/10 text-white/40 border border-white/10'
                  }`}>
                    {step.num}
                  </div>
                  <span className={`text-xs font-semibold ${step.active ? 'text-white' : 'text-white/40'}`}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-white/10 mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

          {/* Left Column: File Dropzone (8 cols) */}
          <div className="lg:col-span-7 card-glow flex flex-col justify-between">
            <div>
              <FileUpload onFileSelect={setFile} />
              <p className="text-center text-xs text-white/40 mt-3">
                Supported formats: PDF, DOCX (Max size: 5MB)
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="btn-primary flex-1 py-3 font-semibold shadow-violet-600/30 flex items-center justify-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                {loading ? 'Processing via NLP Pipeline...' : 'Upload & Analyze Resume'}
              </button>
              <button
                onClick={() => navigate('/seeker')}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column: Tips Panel (5 cols) */}
          <div className="lg:col-span-5 card space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              💡 Tips for better results
            </h3>
            <ul className="space-y-3.5 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Use a clean and updated resume</strong> in PDF or Word DOCX format.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Include all relevant skills</strong>, languages, and technical frameworks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Highlight your key achievements</strong> and measurable quantitative metrics.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Keep it concise and well-formatted</strong> for optimal NLP parser extraction.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Recent Resumes List Section */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-400" />
            Recent Resumes
          </h3>

          {resumes.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No previous resumes found. Upload your first resume above!
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:border-violet-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{r.file_name}</p>
                      <p className="text-xs text-white/40 mt-0.5">Uploaded recently</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold font-mono">
                    92% Match Index
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}