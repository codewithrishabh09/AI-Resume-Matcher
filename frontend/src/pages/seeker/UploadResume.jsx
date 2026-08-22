import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import FileUpload from '../../components/FileUpload'
import api from '../../api/axios'

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
          <p className="text-gray-500 mt-1">Upload your resume to get matched with jobs</p>
        </div>

        <div className="card">
          <FileUpload onFileSelect={setFile} />
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="btn-primary flex-1 py-2.5"
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
            <button
              onClick={() => navigate('/seeker')}
              className="btn-secondary px-6"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-6 card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use PDF or DOCX format for best results</li>
            <li>• Include skills, experience, and education clearly</li>
            <li>• Mention specific technologies and tools</li>
            <li>• Add years of experience for each role</li>
          </ul>
        </div>
      </div>
    </div>
  )
}