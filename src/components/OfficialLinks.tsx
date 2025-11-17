'use client'

import { ExternalLink, Globe, FileText, Truck } from 'lucide-react'

export default function OfficialLinks() {
  const links = [
    {
      id: 'nfe-portal',
      title: 'Portal NFe',
      description: 'Consulta NFe - Receita Federal',
      url: 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g=',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'cte-portal',
      title: 'Portal CTe',
      description: 'Consulta CTe - Receita Federal',
      url: 'https://www.cte.fazenda.gov.br/portal/',
      icon: Truck,
      color: 'bg-green-50 text-green-600 border-green-200',
      hoverColor: 'hover:bg-green-100'
    }
  ]

  const handleLinkClick = (url: string, title: string) => {
    // Abrir em nova aba
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Portais Oficiais
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => {
          const IconComponent = link.icon
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.url, link.title)}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 text-left w-full ${link.color} ${link.hoverColor} hover:border-solid focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">
                      {link.title}
                    </h4>
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {link.description}
                  </p>
                  <div className="mt-2 text-xs opacity-70">
                    Clique para acessar o portal oficial
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-medium text-yellow-800">
              Importante
            </h5>
            <p className="text-sm text-yellow-700 mt-1">
              Os links acima direcionam para os portais oficiais da Receita Federal. 
              São sites seguros e confiáveis para consulta de documentos fiscais eletrônicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}