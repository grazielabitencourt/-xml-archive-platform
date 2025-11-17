import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Nome do arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Validar se é um arquivo XML
    if (!filename.toLowerCase().endsWith('.xml')) {
      return NextResponse.json(
        { error: 'Apenas arquivos XML são permitidos' },
        { status: 400 }
      )
    }

    const uploadDir = join(process.cwd(), 'uploads')
    const filePath = join(uploadDir, filename)

    try {
      // Verificar se o arquivo existe
      await fs.access(filePath)
      
      // Ler o arquivo
      const fileContent = await fs.readFile(filePath)
      
      // Criar resposta com o arquivo
      const response = new NextResponse(new Uint8Array(fileContent))
      
      // Definir headers para download
      response.headers.set('Content-Type', 'application/xml')
      response.headers.set('Content-Disposition', `attachment; filename="${filename}"`)
      response.headers.set('Content-Length', fileContent.length.toString())
      
      return response

    } catch (fileError) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Erro no download do arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}