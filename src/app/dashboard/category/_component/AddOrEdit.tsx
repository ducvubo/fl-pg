'use client'
import {
  Button,
  Form,
  FormProps,
  GetProp,
  Input,
  Select,
  Upload,
  UploadFile,
  UploadProps,
  Image,
  TreeSelect,
  TreeSelectProps
} from 'antd'
import React, { useEffect, useState } from 'react'
import { ICategory } from '../category.interface'
import { createCategory, getAllCategory, updateCategory } from '../category.api'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useLoading } from '@/app/context/LoadingContext'
import { Toast } from '@/app/components/Notification'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  inforCategory?: ICategory
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const normFile = (e: any) => {
  console.log(e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

interface TreeNode {
  title: string
  value: string
  key: string
  children?: TreeNode[]
}

export default function AddOrEdit({ id, inforCategory }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [form] = Form.useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageCategory, setImageCategory] = useState<UploadFile[]>([])
  const [treeData, setTreeData] = useState<any[]>([])
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setImageCategory(newFileList)

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  useEffect(() => {
    if (imageCategory.length > 0) {
      const updatedBanner = imageCategory[0]?.response?.data
        ? imageCategory[0]?.response?.data?.image_cloud
        : imageCategory[0]?.thumbUrl
      setImageCategory([
        {
          ...imageCategory[0],
          thumbUrl: updatedBanner
        }
      ])

      form.setFieldsValue({
        category_image: imageCategory[0]?.response?.data
      })
    }
  }, [imageCategory[0]?.response])

  useEffect(() => {
    const getListCategory = async () => {
      try {
        const res: IBackendRes<ICategory[]> = await getAllCategory()
        if (res?.statusCode === 200 && res.data) {
          setTreeData(buildTreeData(res.data))
        }
      } catch (error) {
        console.error(error)
      }
    }
    getListCategory()
  }, [])

  const buildTreeData = (categories: ICategory[]) => {
    const treeData = categories
      .filter((category) => !category.category_parent_id)
      .map((category) => ({
        title: category.category_name,
        value: category._id,
        key: category._id,
        children: buildChildren(category._id, categories)
      }))

    return treeData
  }

  const buildChildren = (parentId: string, categories: ICategory[]): TreeNode[] => {
    return categories
      .filter((category: any) => category.category_parent_id === parentId)
      .map((category) => ({
        title: category.category_name,
        value: category._id,
        key: category._id,
        children: buildChildren(category._id, categories) // Đệ quy gọi lại hàm để xây dựng cây
      }))
  }

  const onFinish: FormProps<ICategory>['onFinish'] = async (values) => {
    try {
      let res: IBackendRes<ICategory>
      res = id === 'add' ? await createCategory(values) : await updateCategory({ ...values, _id: id })
      console.log(res)
      if (res.statusCode === 201 || res.statusCode === 200) {
        setLoading(false)
        Toast('Thành công', id === 'add' ? 'Tạo danh mục thành công' : 'Cập nhật danh mục thành công', 'success')
        router.push('/dashboard/category')
        router.refresh()
      } else if (res.statusCode === 400) {
        setLoading(false)
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            Toast('Lỗi', item, 'warning')
          })
        } else {
          Toast('Lỗi', res.message, 'warning')
        }
      } else if (res.statusCode === 409 || res.statusCode === 404) {
        setLoading(false)
        Toast('Lỗi', res.message, 'warning')
      } else if (res.code === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      }
    } catch (error) {
      setLoading(false)
      Toast('Lỗi không xác định', 'Vui lòng thử lại sau', 'error')
    }
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<ICategory>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    if (inforCategory) {
      form.setFieldsValue({
        category_name: inforCategory.category_name,
        category_image: inforCategory.category_image ? inforCategory.category_image : '',
        category_description: inforCategory.category_description,
        category_parent_id: inforCategory.category_parent_id?._id
      })

      setImageCategory([
        {
          uid: '-1',
          name: inforCategory.category_image?.image_cloud,
          status: 'done',
          url: inforCategory.category_image?.image_cloud,
          thumbUrl: inforCategory.category_image?.image_cloud
        }
      ])
    }
  }, [inforCategory, id])

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item<ICategory>
        label='Ảnh bìa'
        getValueFromEvent={normFile}
        name='category_image'
        rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
      >
        <div>
          <Upload
            action={`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`}
            maxCount={1}
            listType='picture-card'
            fileList={imageCategory}
            onPreview={handlePreview}
            onChange={handleChange}
            headers={{ folder_type: 'banner_restaurant' }}
          >
            {imageCategory.length >= 1 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage('')
              }}
              src={previewImage}
            />
          )}
        </div>
      </Form.Item>

      <Form.Item<ICategory>
        label='Tên danh mục'
        name='category_name'
        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label='Danh mục' name='category_parent_id'>
        <TreeSelect treeData={treeData} allowClear placeholder='Chọn danh mục' />
      </Form.Item>

      <Form.Item<ICategory> label='Mô tả' name='category_description'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          {id === 'add' ? 'Thêm' : 'Cập nhật'}
        </Button>
      </Form.Item>
    </Form>
  )
}
