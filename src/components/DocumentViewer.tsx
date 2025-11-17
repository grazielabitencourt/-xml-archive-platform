'use client'

import { useState, useEffect } from 'react'
import { X, FileText, Building, Calendar, DollarSign, Package, Truck, Receipt } from 'lucide-react'

interface DocumentDetails {
  id: string
  fileName: string
  type: 'nfe' | 'cte'
  
  // Dados básicos
  number: string
  series: string
  issueDate: string
  
  // Emissor
  issuer: {
    name: string
    cnpj: string
    address: string
    city: string
    state: string
    cep: string
  }
  
  // Destinatário (para NFe) ou Tomador (para CTe)
  recipient: {
    name: string
    cnpj?: string
    cpf?: string
    address: string
    city: string
    state: string
    cep: string
  }
  
  // Valores fiscais
  values: {
    totalValue: number
    totalProducts?: number // NFe
    totalServices?: number // CTe
    icms?: number
    ipi?: number
    pis?: number
    cofins?: number
    totalTaxes: number
  }
  
  // CFOP
  cfop: string
  cfopDescription: string
  
  // Dados específicos por tipo
  nfeData?: {
    items: Array<{
      code: string
      description: string
      quantity: number
      unit: string
      unitValue: number
      totalValue: number
      cfop: string
      ncm: string
    }>
  }
  
  cteData?: {
    serviceType: string
    route: {
      origin: string
      destination: string
    }
    weight: number
    volumes: number
    freight: {
      responsible: 'sender' | 'recipient' | 'carrier'
      value: number
    }
  }
}

interface DocumentViewerProps {
  documentId: string | null
  onClose: () => void
}

export default function DocumentViewer({ documentId, onClose }: DocumentViewerProps) {
  const [document, setDocument] = useState<DocumentDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!documentId) {
      setDocument(null)
      return
    }

    const fetchDocument = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/documents/${documentId}`)
        if (!response.ok) {
          throw new Error('Documento não encontrado')
        }
        const documentData = await response.json()
        setDocument(documentData)
      } catch (error) {
        console.error('Erro ao carregar documento:', error)
        setDocument(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  if (!documentId) return null

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
    return type === 'nfe' ? 'Nota Fiscal Eletrônica' : 'Conhecimento de Transporte Eletrônico'
  }

  const getTypeColor = (type: 'nfe' | 'cte') => {
    return type === 'nfe' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes do Documento
              </h2>
              <p className="text-sm text-gray-500">
                {loading ? 'Carregando...' : document?.fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : document ? (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Receipt className="h-5 w-5" />
                    <span>Informações Básicas</span>
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(document.type)}`}>
                    {getTypeLabel(document.type)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Número</label>
                    <p className="text-lg font-semibold text-gray-900">{document.number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Série</label>
                    <p className="text-lg font-semibold text-gray-900">{document.series}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Data de Emissão</label>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(document.issueDate)}</p>
                  </div>
                </div>
              </div>

              {/* CFOP */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                  <Package className="h-5 w-5" />
                  <span>CFOP - Código Fiscal de Operações</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Código</label>
                    <p className="text-2xl font-bold text-yellow-700">{document.cfop}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Descrição</label>
                    <p className="text-sm text-gray-900">{document.cfopDescription}</p>
                  </div>
                </div>
              </div>

              {/* Valores Fiscais */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                  <DollarSign className="h-5 w-5" />
                  <span>Valores Fiscais</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-500">Valor Total</label>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(document.values.totalValue)}</p>
                  </div>
                  {document.values.totalProducts && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-500">Produtos</label>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(document.values.totalProducts)}</p>
                    </div>
                  )}
                  {document.values.totalServices && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-500">Serviços</label>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(document.values.totalServices)}</p>
                    </div>
                  )}
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-500">Total Tributos</label>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(document.values.totalTaxes)}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-green-200">
                  {document.values.icms && (
                    <div className="text-center">
                      <label className="block text-xs font-medium text-gray-500">ICMS</label>
                      <p className="text-sm font-medium text-gray-700">{formatCurrency(document.values.icms)}</p>
                    </div>
                  )}
                  {document.values.ipi && (
                    <div className="text-center">
                      <label className="block text-xs font-medium text-gray-500">IPI</label>
                      <p className="text-sm font-medium text-gray-700">{formatCurrency(document.values.ipi)}</p>
                    </div>
                  )}
                  {document.values.pis && (
                    <div className="text-center">
                      <label className="block text-xs font-medium text-gray-500">PIS</label>
                      <p className="text-sm font-medium text-gray-700">{formatCurrency(document.values.pis)}</p>
                    </div>
                  )}
                  {document.values.cofins && (
                    <div className="text-center">
                      <label className="block text-xs font-medium text-gray-500">COFINS</label>
                      <p className="text-sm font-medium text-gray-700">{formatCurrency(document.values.cofins)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emissor */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                  <Building className="h-5 w-5" />
                  <span>Emissor</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Razão Social</label>
                    <p className="text-base font-medium text-gray-900">{document.issuer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CNPJ</label>
                    <p className="text-base font-medium text-gray-900">{document.issuer.cnpj}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-base text-gray-900">
                      {document.issuer.address}, {document.issuer.city}/{document.issuer.state} - CEP: {document.issuer.cep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Destinatário/Tomador */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                  <Building className="h-5 w-5" />
                  <span>{document.type === 'nfe' ? 'Destinatário' : 'Tomador do Serviço'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nome/Razão Social</label>
                    <p className="text-base font-medium text-gray-900">{document.recipient.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {document.recipient.cnpj ? 'CNPJ' : 'CPF'}
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {document.recipient.cnpj || document.recipient.cpf}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-base text-gray-900">
                      {document.recipient.address}, {document.recipient.city}/{document.recipient.state} - CEP: {document.recipient.cep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados específicos por tipo */}
              {document.type === 'nfe' && document.nfeData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Itens da Nota Fiscal</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vl. Unit.</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vl. Total</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">NCM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {document.nfeData.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{item.code}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.unit}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.unitValue)}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(item.totalValue)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.ncm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {document.type === 'cte' && document.cteData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                    <Truck className="h-5 w-5" />
                    <span>Dados do Transporte</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tipo de Serviço</label>
                      <p className="text-base font-medium text-gray-900">{document.cteData.serviceType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Responsável pelo Frete</label>
                      <p className="text-base font-medium text-gray-900">
                        {document.cteData.freight.responsible === 'sender' ? 'Remetente' : 
                         document.cteData.freight.responsible === 'recipient' ? 'Destinatário' : 'Transportadora'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Origem</label>
                      <p className="text-base text-gray-900">{document.cteData.route.origin}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Destino</label>
                      <p className="text-base text-gray-900">{document.cteData.route.destination}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Peso (kg)</label>
                      <p className="text-base font-medium text-gray-900">{document.cteData.weight.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Volumes</label>
                      <p className="text-base font-medium text-gray-900">{document.cteData.volumes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Documento não encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">Não foi possível carregar os detalhes do documento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}