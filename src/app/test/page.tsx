'use client'
import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import './abc.css'

export default function EditorTinytest() {
  const editorRef = useRef<any>(null)
  const [editorContent, setEditorContent] = useState<string>('')
  const handleImageUpload: any = (blobInfo: any, progress: any, failure: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload/blog`, true)
      xhr.setRequestHeader('folder_type', 'blog')
      const formData = new FormData()
      formData.append('upload', blobInfo.blob(), blobInfo.filename())

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100)
        if (progress && typeof progress === 'function') {
          const percent = 0
          progress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
          return
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status)
          return
        }

        const json = JSON.parse(xhr.responseText)

        if (!json || typeof json.url != 'string') {
          reject('Invalid JSON: ' + xhr.responseText)
          return
        }
        console.log(json.url)
        resolve(json.url)
      }

      xhr.onerror = () => {
        reject({ message: 'Image upload failed', remove: true })
        if (failure && typeof failure === 'function') {
          failure('Image upload failed')
        }
      }

      xhr.send(formData)
    })
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }
  console.log(editorContent)
  return (
    <div>
      <Editor
        apiKey={`${process.env.NEXT_PUBLIC_API_KEY_TINY_CME}`}
        onInit={(evt, editor) => (editorRef.current = editor)}
        // onChange={() => {
        //   if (editorRef.current) {
        //     handleEditorChange(editorRef.current.getContent())
        //   }
        // }}
        onEditorChange={handleEditorChange}
        init={{
          plugins: [
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'image',
            'link',
            'lists',
            'media',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'checklist',
            'mediaembed',
            'casechange',
            'export',
            'formatpainter',
            'pageembed',
            'a11ychecker',
            // 'tinymcespellchecker',
            'permanentpen',
            'powerpaste',
            'advtable',
            'advcode',
            'editimage',
            'advtemplate',
            // 'ai',
            'mentions',
            'tinycomments',
            'tableofcontents',
            'footnotes',
            'mergetags',
            'autocorrect',
            'typography',
            'inlinecss',
            'markdown'
          ],
          toolbar:
            'undo redo |  | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' }
          ],
          images_upload_url: `${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload/blog`,
          automatic_uploads: true,
          images_reuse_filename: true,
          images_upload_handler: handleImageUpload,
          theme_advanced_buttons1:
            'save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect',
          theme_advanced_buttons2:
            'cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor',
          theme_advanced_buttons3:
            'tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen',
          table_default_attributes: {
            border: '1px solid #ccc',
            'border-collapse': 'collapse'
          }
          // table_default_styles: {
          //   'border-collapsed': 'collapse',
          //   width: 'auto'
          // },
          // invalid_styles: {
          //   td: 'width height',
          //   th: 'width height',
          //   tr: 'height'
          // },
          // table_responsive_width: true,
          // table_resize_bars: false
        }}
        initialValue=''
      />

      <div>
        <h2>Rendered HTML:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>
    </div>
  )
}
