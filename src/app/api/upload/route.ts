import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'

export const POST = async (req: any) => {
  try {
    const header = req.headers
    const folder_type = header.get('folder_type') || ''
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const formDataToSend = new FormData()
    formDataToSend.append('file', new Blob([buffer]), file.name)
    const response = await fetch(`${process.env.URL_SERVER}/upload`, {
      method: 'POST',
      headers: {
        folder_type
      },
      body: formDataToSend
    })
    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: result.statusCode
    })
  } catch (error) {
    console.log('Error occurred:', error)
    return NextResponse.json({ Message: 'Failed', status: 500 })
  }
}
