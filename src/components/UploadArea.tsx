'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

interface UploadedFile {
  file: File
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export default function UploadArea() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (files: FileList) => {
    const xmlFiles = Array.from(files).filter(file => 
      file.name.toLowerCase().endsWith('.xml')
    )

    if (xmlFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos XML.')
      return
    }

    const newUploads: UploadedFile[] = xmlFiles.map(file => ({
      file,
      status: 'uploading'
    }))

    setUploadedFiles(prev => [...prev, ...newUploads])

    // Simular upload - aqui você implementaria a lógica real
    for (let i = 0; i < newUploads.length; i++) {
      try {
        // Simular delay de upload
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setUploadedFiles(prev => 
          prev.map(upload => 
            upload.file === newUploads[i].file 
              ? { ...upload, status: 'success' }
              : upload
          )
        )
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(upload => 
            upload.file === newUploads[i].file 
              ? { ...upload, status: 'error', error: 'Erro no upload' }
              : upload
          )
        )
      }
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Arraste arquivos XML aqui ou{' '}
              <span className="text-blue-600 hover:text-blue-500">
                clique para selecionar
              </span>
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept=".xml"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Aceita apenas arquivos XML (NFe, CTe)
        </p>
      </div>

      {/* Upload Status */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">
            Status do Upload
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((upload, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  {upload.status === 'success' && (
                    <FileText className="h-5 w-5 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <span className="text-sm text-blue-600">Enviando...</span>
                  )}
                  {upload.status === 'success' && (
                    <span className="text-sm text-green-600">Concluído</span>
                  )}
                  {upload.status === 'error' && (
                    <span className="text-sm text-red-600">Erro</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}