'use client'

import { useState, useEffect, useMemo } from 'react'
import { FileText, Download, Eye, Calendar, Building } from 'lucide-react'

interface Document {
  id: string
  fileName: string
  type: 'nfe' | 'cte'
  number: string
  issueDate: string
  company: string
  cnpj: string
  value?: number
  size: number
  uploadDate: string
}

interface DocumentListProps {
  filters?: {
    searchTerm: string
    selectedType: string
    selectedYear: string
  }
}

export default function DocumentList({ filters }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Simular carregamento de dados
    const mockData: Document[] = [
      {
        id: '1',
        fileName: 'NFe_12345678901234_001001.xml',
        type: 'nfe',
        number: '001001',
        issueDate: '2024-11-10',
        company: 'Empresa Exemplo LTDA',
        cnpj: '12.345.678/0001-90',
        value: 1500.50,
        size: 45320,
        uploadDate: '2024-11-11'
      },
      {
        id: '2',
        fileName: 'CTe_98765432109876_000123.xml',
        type: 'cte',
        number: '000123',
        issueDate: '2024-11-09',
        company: 'Transportadora ABC',
        cnpj: '98.765.432/0001-10',
        size: 32150,
        uploadDate: '2024-11-11'
      },
      {
        id: '3',
        fileName: 'NFe_11122233344455_002001.xml',
        type: 'nfe',
        number: '002001',
        issueDate: '2024-11-08',
        company: 'Comércio XYZ S/A',
        cnpj: '11.122.233/0001-44',
        value: 890.75,
        size: 52800,
        uploadDate: '2024-11-10'
      },
      {
        id: '4',
        fileName: 'CTe_55566677788899_000456.xml',
        type: 'cte',
        number: '000456',
        issueDate: '2023-08-15',
        company: 'Logística Fast LTDA',
        cnpj: '55.566.677/0001-88',
        size: 28900,
        uploadDate: '2023-08-16'
      },
      {
        id: '5',
        fileName: 'NFe_99988877766655_003001.xml',
        type: 'nfe',
        number: '003001',
        issueDate: '2023-12-20',
        company: 'Varejo Online S/A',
        cnpj: '99.988.877/0001-66',
        value: 2150.75,
        size: 41200,
        uploadDate: '2023-12-21'
      },
      {
        id: '6',
        fileName: 'CTe_11223344556677_000789.xml',
        type: 'cte',
        number: '000789',
        issueDate: '2022-05-10',
        company: 'Transportes Sul LTDA',
        cnpj: '11.223.344/0001-55',
        size: 35600,
        uploadDate: '2022-05-11'
      }
    ]

    setTimeout(() => {
      setDocuments(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  // Aplicar filtros aos documentos
  const filteredDocuments = useMemo(() => {
    if (!filters) return documents

    return documents.filter(doc => {
      // Filtro por tipo
      if (filters.selectedType !== 'all' && doc.type !== filters.selectedType) {
        return false
      }

      // Filtro por ano
      if (filters.selectedYear !== 'all') {
        const docYear = new Date(doc.issueDate).getFullYear().toString()
        if (docYear !== filters.selectedYear) {
          return false
        }
      }

      // Filtro por termo de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        return (
          doc.number.toLowerCase().includes(searchLower) ||
          doc.company.toLowerCase().includes(searchLower) ||
          doc.cnpj.includes(searchLower) ||
          doc.fileName.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [documents, filters])

  // Reset da página quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Função para fazer download do documento
  const handleDownload = async (fileName: string) => {
    if (downloadingFiles.has(fileName)) return // Evitar downloads duplos
    
    try {
      setDownloadingFiles(prev => new Set(prev).add(fileName))
      
      const response = await fetch(`/api/documents/download/${encodeURIComponent(fileName)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(`Erro ao baixar arquivo: ${errorData.error}`)
        return
      }

      // Criar blob e fazer download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Erro no download:', error)
      alert('Erro ao baixar o arquivo. Tente novamente.')
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(fileName)
        return newSet
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTypeLabel = (type: 'nfe' | 'cte') => {
    return type === 'nfe' ? 'NFe' : 'CTe'
  }

  const getTypeColor = (type: 'nfe' | 'cte') => {
    return type === 'nfe' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Lista de documentos */}
      <div className="space-y-3">
        {currentDocuments.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.fileName}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                      {getTypeLabel(doc.type)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Número:</span>
                      <span>{doc.number}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(doc.issueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span className="truncate">{doc.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>CNPJ: {doc.cnpj}</span>
                    </div>
                  </div>

                  {doc.value && (
                    <div className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">Valor: </span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency(doc.value)}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                    <span>Tamanho: {formatFileSize(doc.size)}</span>
                    <span>Upload: {formatDate(doc.uploadDate)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Visualizar documento"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDownload(doc.fileName)}
                  disabled={downloadingFiles.has(doc.fileName)}
                  className={`p-2 rounded-full transition-colors ${
                    downloadingFiles.has(doc.fileName)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={downloadingFiles.has(doc.fileName) ? "Baixando..." : "Baixar documento"}
                >
                  {downloadingFiles.has(doc.fileName) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-gray-500">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDocuments.length)} de {filteredDocuments.length} documentos
            {filters && filteredDocuments.length !== documents.length && (
              <span className="ml-2 text-blue-600">
                (filtrado de {documents.length} total)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-blue-600 bg-blue-50 border border-blue-300'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {documents.length === 0 ? 'Nenhum documento encontrado' : 'Nenhum documento corresponde aos filtros'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {documents.length === 0 ? 'Faça o upload de arquivos XML para começar.' : 'Tente ajustar os filtros de busca.'}
          </p>
        </div>
      )}
    </div>
  )
}