import { useState, useRef } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'

export default function FileUpload({ onFileSelect, accept = '.pdf,.docx,.doc' }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
    fileRef.current.value = ''
  }

  return (
    <div>
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
            }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-violet-400" />
          </div>
          <p className="text-white font-medium mb-1">
            Drop your resume here or <span className="text-violet-400">browse</span>
          </p>
          <p className="text-white/30 text-sm">PDF, DOCX up to 10MB</p>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <File className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-white/40">{(selectedFile.size / 1024).toFixed(0)} KB</p>
          </div>
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <button onClick={removeFile} className="text-white/30 hover:text-red-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}