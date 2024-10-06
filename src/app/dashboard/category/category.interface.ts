export interface ICategory {
  _id: string
  category_name: string
  category_image: {
    image_cloud: string
    image_custom: string
  }
  category_slug: string
  category_description: string
  category_parent_id: ICategory
  category_status: 'enable' | 'disable'
  isDeleted: boolean
}
