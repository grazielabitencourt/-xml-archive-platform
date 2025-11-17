'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onFilterChange) {
      onFilterChange({ searchTerm, selectedType, selectedYear })
    }
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
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

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </button>
        </div>
      </div>
    </form>
  )
}