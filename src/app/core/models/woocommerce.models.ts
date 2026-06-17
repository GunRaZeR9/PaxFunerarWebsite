export interface WcImage {
  id: number;
  src: string;
  alt: string;
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WcCategory[];
  images: WcImage[];
  meta_data: Array<{ key: string; value: string }>;
}

export interface WcOrderLineItem {
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  total?: string;
}

export interface WcBilling {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1?: string;
  city?: string;
  postcode?: string;
  country: string;
}

export interface WcOrderPayload {
  line_items: WcOrderLineItem[];
  billing: WcBilling;
  payment_method: 'cod' | 'card';
  lang?: string;
}

export interface WcOrder {
  id: number;
  status: string;
  total: string;
  order_key: string;
  billing: WcBilling;
  line_items: WcOrderLineItem[];
}
