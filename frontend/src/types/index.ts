export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
  display_order: number;
  products_count?: number;
}

export interface Product {
  id: number;
  category: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  discounted_price: string | null;
  effective_price: string;
  image: string;
  is_vegetarian: boolean;
  is_available: boolean;
  is_featured: boolean;
  preparation_time_minutes: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItemRecord {
  id: number;
  product: number | null;
  product_name_snapshot: string;
  unit_price_snapshot: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  public_reference: string;
  order_type: OrderType;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: string;
  discount_amount: string;
  delivery_fee: string;
  total: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: string;
  customer_notes?: string;
  table_number?: string;
  items: OrderItemRecord[];
  created_at: string;
  updated_at: string;
}

export interface CafeTable {
  id: number;
  table_number: string;
  capacity: number;
  location: 'indoor' | 'patio' | 'lounge';
  location_display: string;
  is_active: boolean;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Reservation {
  reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: ReservationStatus;
  special_requests?: string;
  table_number?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  is_demo: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  image: string;
  caption: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  country: string;
  address_placeholder: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  opening_days: string;
  delivery_available: boolean;
  delivery_fee: string;
  free_delivery_threshold: string;
  currency: string;
  currency_symbol: string;
  google_maps_url: string;
  instagram_handle: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface DashboardMetrics {
  total_orders: number;
  orders_today: number;
  pending_orders: number;
  total_sales: string;
  pending_reservations: number;
  confirmed_reservations: number;
}
