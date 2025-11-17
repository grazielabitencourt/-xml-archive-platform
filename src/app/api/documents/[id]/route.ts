import { NextRequest, NextResponse } from 'next/server'

// Interface para os dados detalhados do documento
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

// Mock data para demonstração
const generateMockDocument = (id: string): DocumentDetails | null => {
  const mockDocuments: Record<string, DocumentDetails> = {
    '1': {
      id: '1',
      fileName: 'NFe_12345678901234_001001.xml',
      type: 'nfe',
      number: '001001',
      series: '1',
      issueDate: '2024-11-10',
      
      issuer: {
        name: 'Tecnologia Exemplo LTDA',
        cnpj: '12.345.678/0001-90',
        address: 'Rua das Flores, 123, Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      
      recipient: {
        name: 'Cliente ABC Comércio',
        cnpj: '98.765.432/0001-10',
        address: 'Av. Principal, 456, Comercial',
        city: 'Rio de Janeiro',
        state: 'RJ',
        cep: '20000-123'
      },
      
      values: {
        totalValue: 1500.50,
        totalProducts: 1300.00,
        icms: 180.00,
        ipi: 65.00,
        pis: 15.60,
        cofins: 72.00,
        totalTaxes: 332.60
      },
      
      cfop: '5102',
      cfopDescription: 'Venda de mercadoria adquirida ou recebida de terceiros',
      
      nfeData: {
        items: [
          {
            code: 'PROD001',
            description: 'Notebook Dell Inspiron 15 3000',
            quantity: 2,
            unit: 'UN',
            unitValue: 425.00,
            totalValue: 850.00,
            cfop: '5102',
            ncm: '8471.30.12'
          },
          {
            code: 'PROD002',
            description: 'Mouse Wireless Logitech',
            quantity: 5,
            unit: 'UN',
            unitValue: 90.00,
            totalValue: 450.00,
            cfop: '5102',
            ncm: '8471.60.52'
          }
        ]
      }
    },
    
    '2': {
      id: '2',
      fileName: 'CTe_98765432109876_000123.xml',
      type: 'cte',
      number: '000123',
      series: '1',
      issueDate: '2024-11-09',
      
      issuer: {
        name: 'Transportadora ABC LTDA',
        cnpj: '98.765.432/0001-10',
        address: 'Rod. BR-116, Km 120',
        city: 'São Paulo',
        state: 'SP',
        cep: '08500-000'
      },
      
      recipient: {
        name: 'Empresa Destino S/A',
        cnpj: '11.222.333/0001-44',
        address: 'Rua do Comércio, 789',
        city: 'Rio de Janeiro',
        state: 'RJ',
        cep: '21000-456'
      },
      
      values: {
        totalValue: 1500.50,
        totalServices: 1500.50,
        icms: 240.00,
        pis: 9.78,
        cofins: 45.02,
        totalTaxes: 294.80
      },
      
      cfop: '6353',
      cfopDescription: 'Prestação de serviço de transporte',
      
      cteData: {
        serviceType: 'Transporte Rodoviário de Cargas',
        route: {
          origin: 'São Paulo/SP',
          destination: 'Rio de Janeiro/RJ'
        },
        weight: 1250.5,
        volumes: 15,
        freight: {
          responsible: 'sender',
          value: 1500.50
        }
      }
    },
    
    '3': {
      id: '3',
      fileName: 'NFe_11122233344455_002001.xml',
      type: 'nfe',
      number: '002001',
      series: '1',
      issueDate: '2024-11-08',
      
      issuer: {
        name: 'Comércio XYZ S/A',
        cnpj: '11.122.233/0001-44',
        address: 'Av. Comercial, 456',
        city: 'Belo Horizonte',
        state: 'MG',
        cep: '30000-123'
      },
      
      recipient: {
        name: 'Maria da Silva',
        cpf: '123.456.789-00',
        address: 'Rua Residencial, 123',
        city: 'Belo Horizonte',
        state: 'MG',
        cep: '30100-456'
      },
      
      values: {
        totalValue: 890.75,
        totalProducts: 750.00,
        icms: 90.00,
        pis: 7.31,
        cofins: 33.69,
        totalTaxes: 131.00
      },
      
      cfop: '5101',
      cfopDescription: 'Venda de produção do estabelecimento',
      
      nfeData: {
        items: [
          {
            code: 'PROD003',
            description: 'Smartphone Samsung Galaxy A14',
            quantity: 1,
            unit: 'UN',
            unitValue: 750.00,
            totalValue: 750.00,
            cfop: '5101',
            ncm: '8517.12.31'
          }
        ]
      }
    }
  }
  
  return mockDocuments[id] || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'ID do documento é obrigatório' },
        { status: 400 }
      )
    }
    
    // Simular latência da rede
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const document = generateMockDocument(documentId)
    
    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(document)
    
  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}