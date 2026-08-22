import { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

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
    const file = e.dataTransfer.files[0]
    handleFile(file)
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">
            Drop your resume here or <span className="text-indigo-600">browse</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <File className="h-8 w-8 text-indigo-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={removeFile} className="text-gray-400 hover:text-red-500">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}