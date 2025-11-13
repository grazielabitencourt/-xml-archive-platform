import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'uploads')
    
    let totalSize = 0
    let fileCount = 0
    
    try {
      const files = await fs.readdir(uploadDir)
      
      for (const fileName of files) {
        const filePath = join(uploadDir, fileName)
        const stats = await fs.stat(filePath)
        totalSize += stats.size
        fileCount++
      }
    } catch {
      // Diretório não existe ainda
    }

    // Simular dados adicionais para demonstração
    const mockData = {
      totalStorage: 107374182400, // 100 GB
      usedStorage: totalSize || 21474836480, // Usar tamanho real ou valor simulado
      documentCount: fileCount || 15420,
      monthlyUploads: 1250,
      storageBreakdown: {
        nfe: Math.floor((fileCount || 15420) * 0.7),
        cte: Math.floor((fileCount || 15420) * 0.3)
      }
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}