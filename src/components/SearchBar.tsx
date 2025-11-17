'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onFilterChange?: (filters: {
    searchTerm: string
    selectedType: string
    selectedYear: string
  }) => void
}

export default function SearchBar({ onFilterChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  // Atualizar filtros em tempo real
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ searchTerm, selectedType, selectedYear })
    }
  }, [searchTerm, selectedType, selectedYear, onFilterChange])

  // Verificar se há filtros ativos
  const hasActiveFilters = searchTerm !== '' || selectedType !== 'all' || selectedYear !== 'all'

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedYear('all')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de busca */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por número, CNPJ, razão social..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <div className="min-w-0 flex-1 sm:flex-none">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              <option value="nfe">NFe</option>
              <option value="cte">CTe</option>
            </select>
          </div>

          <div className="min-w-0 flex-1 sm:flex-none">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Todos os anos</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Limpar filtros"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Filtros ativos:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Busca: "{searchTerm}"
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Tipo: {selectedType.toUpperCase()}
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Ano: {selectedYear}
            </span>
          )}
        </div>
      )}
    </div>
  )
}