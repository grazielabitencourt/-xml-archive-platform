import UploadArea from '@/components/UploadArea'
import DocumentList from '@/components/DocumentList'
import SearchBar from '@/components/SearchBar'
import StorageInfo from '@/components/StorageInfo'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Storage Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informações de Armazenamento
        </h2>
        <StorageInfo />
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload de Documentos
        </h2>
        <UploadArea />
      </div>

      {/* Search and List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Documentos Arquivados
          </h2>
        </div>
        
        <div className="mb-6">
          <SearchBar />
        </div>

        <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <DocumentList />
        </Suspense>
      </div>
    </div>
  )
}