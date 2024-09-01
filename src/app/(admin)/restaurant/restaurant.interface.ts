export interface IUpLoadImage {
  image_cloud: string
  image_local: string
  image_custom: string
}

export interface IAddress {
  label: string
  value: string
}

export interface IRestaurantAddress {
  address_province: IAddress
  address_district: IAddress
  address_ward: IAddress
  address_specific: string
}

export interface IRestaurantType {
  _id: string
  restaurant_type_name: string
}

export interface IAmenity {
  _id: string
  amenity_name: string
}

export interface IRestaurantPrice {
  restaurant_price_option: 'range' | 'down' | 'up'
  restaurant_price_min?: number
  restaurant_price_max?: number
  restaurant_price_amount?: number
}

export interface IRestaurantHours {
  day_of_week: string
  open: {
    label: string
    value: string
  }
  close: {
    label: string
    value: string
  }
}

export interface IMarkDown {
  text: string
  html: string
}

export interface IRestaurantPropose {
  propose_consultation_reservation: IMarkDown
  propose_bundled_offer: IMarkDown
  propose_note: IMarkDown
}

export interface RestaurantOverview {
  //Phù hợp
  overview_suitable: string[]

  //Món đặc sắc
  overview_specialty_dish: string[]

  //Không gian
  overview_space: string[]

  //Để xe
  overview_parking_area: string[]

  //Đặc trưng
  overview_characteristic: string[]
}

export interface IRestaurant {
  restaurant_email: string
  restaurant_password: string
  restaurant_phone: string
  restaurant_category: string
  restaurant_name: string
  restaurant_banner: IUpLoadImage
  restaurant_address: IRestaurantAddress
  restaurant_type: string[]
  restaurant_price: IRestaurantPrice
  restaurant_hours: IRestaurantHours[]
  restaurant_propose: IRestaurantPropose
  restaurant_overview: RestaurantOverview
  restaurant_regulation: IMarkDown
  restaurant_parking_area: IMarkDown
  restaurant_amenity: string[]
  restaurant_image: IUpLoadImage[]
  restaurant_description: IMarkDown
}
