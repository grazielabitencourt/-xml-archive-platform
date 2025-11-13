import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'
import { XMLParser } from 'fast-xml-parser'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = data.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const uploadDir = join(process.cwd(), 'uploads')
    
    // Criar diretório se não existir
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    const results = []

    for (const file of files) {
      // Validar se é um arquivo XML
      if (!file.name.toLowerCase().endsWith('.xml')) {
        results.push({
          fileName: file.name,
          status: 'error',
          error: 'Arquivo deve ser XML'
        })
        continue
      }

      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Salvar arquivo
        const fileName = `${Date.now()}_${file.name}`
        const filePath = join(uploadDir, fileName)
        await fs.writeFile(filePath, buffer)

        // Tentar extrair metadados do XML
        const xmlContent = buffer.toString('utf-8')
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_'
        })
        
        let metadata = {}
        try {
          const xmlData = parser.parse(xmlContent)
          
          // Detectar tipo de documento
          let documentType = 'unknown'
          if (xmlData.nfeProc || xmlData.NFe) {
            documentType = 'nfe'
          } else if (xmlData.cteProc || xmlData.CTe) {
            documentType = 'cte'
          }

          metadata = {
            type: documentType,
            size: buffer.length,
            uploadDate: new Date().toISOString()
          }
        } catch (parseError) {
          console.warn('Erro ao fazer parse do XML:', parseError)
        }

        results.push({
          fileName: file.name,
          status: 'success',
          metadata
        })

      } catch (error) {
        results.push({
          fileName: file.name,
          status: 'error',
          error: 'Erro ao processar arquivo'
        })
      }
    }

    return NextResponse.json({ results })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'uploads')
    
    try {
      const files = await fs.readdir(uploadDir)
      const fileStats = await Promise.all(
        files.map(async (fileName) => {
          const filePath = join(uploadDir, fileName)
          const stats = await fs.stat(filePath)
          return {
            fileName,
            size: stats.size,
            uploadDate: stats.birthtime.toISOString(),
            modifiedDate: stats.mtime.toISOString()
          }
        })
      )

      return NextResponse.json({ files: fileStats })
    } catch {
      return NextResponse.json({ files: [] })
    }

  } catch (error) {
    console.error('Erro ao listar arquivos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}