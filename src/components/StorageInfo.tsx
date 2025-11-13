'use client'

import { useState, useEffect } from 'react'
import { HardDrive, FileText, TrendingUp } from 'lucide-react'

interface StorageData {
  totalStorage: number // em bytes
  usedStorage: number // em bytes
  documentCount: number
  monthlyUploads: number
}

export default function StorageInfo() {
  const [storageData, setStorageData] = useState<StorageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados de armazenamento
    const mockData: StorageData = {
      totalStorage: 107374182400, // 100 GB em bytes
      usedStorage: 21474836480,   // 20 GB em bytes
      documentCount: 15420,
      monthlyUploads: 1250
    }

    setTimeout(() => {
      setStorageData(mockData)
      setLoading(false)
    }, 500)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  if (loading || !storageData) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const usagePercentage = (storageData.usedStorage / storageData.totalStorage) * 100

  return (
    <div className="space-y-6">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <HardDrive className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Armazenamento</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatFileSize(storageData.usedStorage)}
            </p>
            <p className="text-sm text-gray-500">
              de {formatFileSize(storageData.totalStorage)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Documentos</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(storageData.documentCount)}
            </p>
            <p className="text-sm text-gray-500">XMLs arquivados</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Este Mês</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(storageData.monthlyUploads)}
            </p>
            <p className="text-sm text-gray-500">novos uploads</p>
          </div>
        </div>
      </div>

      {/* Barra de progresso do armazenamento */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Uso do Armazenamento
          </span>
          <span className="text-sm text-gray-500">
            {usagePercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercentage > 90 
                ? 'bg-red-600' 
                : usagePercentage > 75 
                ? 'bg-yellow-600' 
                : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{formatFileSize(storageData.totalStorage)}</span>
        </div>
      </div>

      {/* Alertas de armazenamento */}
      {usagePercentage > 85 && (
        <div className={`p-4 rounded-md ${
          usagePercentage > 95 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <HardDrive className={`h-5 w-5 ${
                usagePercentage > 95 ? 'text-red-400' : 'text-yellow-400'
              }`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                usagePercentage > 95 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {usagePercentage > 95 ? 'Armazenamento quase esgotado' : 'Armazenamento com pouco espaço'}
              </h3>
              <div className={`mt-2 text-sm ${
                usagePercentage > 95 ? 'text-red-700' : 'text-yellow-700'
              }`}>
                <p>
                  {usagePercentage > 95 
                    ? 'Você está usando mais de 95% do seu armazenamento disponível.'
                    : 'Você está usando mais de 85% do seu armazenamento disponível.'
                  } Considere fazer limpeza de arquivos antigos ou expandir o armazenamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}