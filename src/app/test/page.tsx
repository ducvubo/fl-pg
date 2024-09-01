'use client'
import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import Quote from '@editorjs/quote'
// @ts-ignore
import RawTool from '@editorjs/raw'
// @ts-ignore
import Checklist from '@editorjs/checklist'
// @ts-ignore
import Embed from '@editorjs/embed'
// @ts-ignore
import LinkTool from '@editorjs/link'
// @ts-ignore
import Marker from '@editorjs/marker'
// @ts-ignore
import Code from '@editorjs/code'
import edjsParser from 'editorjs-html'
// @ts-ignore
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import Table from '@editorjs/table'
// @ts-ignore
import Warning from '@editorjs/warning'
import Delimiter from '@editorjs/delimiter'
// @ts-ignore
// import Paragraph from '@editorjs/paragraph'
import Paragraph from 'editorjs-paragraph-with-alignment'
export default function BlogEditor() {
  const editorRef = useRef<EditorJS | null>(null)
  const [savedContent, setSavedContent] = useState<string>('')
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'Start writing your blog...',
      tools: {
        alignment: {
          class: AlignmentTuneTool,
          config: {
            default: 'left',
            blocks: {
              header: 'center',
              list: 'left',
              paragraph: 'justify'
            }
          }
        },
        header: {
          // @ts-ignore
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6], // Các cấp độ tiêu đề từ h1 đến h6
            defaultLevel: 2
          },
          tunes: ['alignment']
        },
        list: {
          // @ts-ignore
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          },
          tunes: ['alignment']
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              instagram: true,
              twitter: true,
              codepen: true
            }
          },
          tunes: ['alignment']
        },
        image: {
          // @ts-ignore
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile',
              byUrl: 'http://localhost:8008/fetchUrl'
            },
            field: 'image',
            types: 'image/*'
          },
          tunes: ['alignment']
        },
        inlineCode: InlineCode,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'http://localhost:5000/fetchUrl'
          },
          tunes: ['alignment']
        },
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
          tunes: ['alignment']
        },
        quote: {
          // @ts-ignore
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author"
          },
          tunes: ['alignment']
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
          tunes: ['alignment']
        },
        raw: RawTool,
        code: {
          class: Code,
          config: {
            placeholder: 'Enter your code here...'
          },
          tunes: ['alignment']
        },
        table: {
          // @ts-ignore
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message'
          }
        },
        delimiter: Delimiter,
        paragraph: {
          class: Paragraph,
          inlineToolbar: true
        }
      },
      autofocus: true,
      onReady: () => {
        console.log('Editor.js is ready to work!')
      },
      onChange: async () => {
        console.log('Content changed')
      }
    })

    editorRef.current = editor

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save()
        console.log('Saved data:', savedData)

        const parser = edjsParser()
        const html = parser.parse(savedData) // Chuyển đổi JSON sang HTML
        const renderedHTML = html.join('') // Ghép mảng HTML thành chuỗi

        // Set nội dung đã chuyển đổi vào state
        setSavedContent(renderedHTML)
        // // Gửi dữ liệu lên backend
        // const response = await fetch('http://localhost:5000/savePost', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(savedData)
        // })

        // if (response.ok) {
        //   console.log('Post saved successfully')
        // } else {
        //   console.error('Failed to save post')
        // }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }
  }

  return (
    <div>
      <h2>Create Your Blog Post</h2>
      <div id='editorjs' style={{ padding: '10px', border: '1px solid #ddd', minHeight: '300px' }}></div>
      <style jsx>{`
        .ce-header.ce-header--level-1 {
          font-size: 5em; /* Cấp độ h1 */
          font-weight: bold;
        }
        .ce-header.ce-header--level-2 {
          font-size: 1.5em; /* Cấp độ h2 */
          font-weight: bold;
        }
        .ce-header.ce-header--level-3 {
          font-size: 1.17em; /* Cấp độ h3 */
          font-weight: bold;
        }
        .ce-header.ce-header--level-4 {
          font-size: 1em; /* Cấp độ h4 */
          font-weight: bold;
        }
        .ce-header.ce-header--level-5 {
          font-size: 0.83em; /* Cấp độ h5 */
          font-weight: bold;
        }
        .ce-header.ce-header--level-6 {
          font-size: 0.67em; /* Cấp độ h6 */
          font-weight: bold;
        }
      `}</style>

      <button onClick={handleSave} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
        Save Post
      </button>
      <div>
        <div dangerouslySetInnerHTML={{ __html: savedContent }} />
      </div>
    </div>
  )
}
