'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'

export default function HeaderLinks() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const links = [
    {
      title: 'Portal NFe',
      url: 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g=',
      color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Portal CTe',
      url: 'https://www.cte.fazenda.gov.br/portal/',
      color: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
    }
  ]

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-500">
        Documentos Fiscais Eletrônicos
      </div>
      
      {/* Desktop Links */}
      <div className="hidden sm:flex items-center space-x-3">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${link.color}`}
          >
            {link.title}
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="relative sm:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
        >
          Portais
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                  <ExternalLink className="ml-auto h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}