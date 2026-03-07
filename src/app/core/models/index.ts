// ===== CLIENT =====
export interface Client {
  id: number;
  groomName: string;
  brideName: string;
  groomPhone: string;
  bridePhone: string;
  email: string;
  address: string;
  budget: number;
  budgetCategory: BudgetCategory;
  createdAt: string;
}

export type BudgetCategory = 'Economical' | 'Standard' | 'Premium' | 'Luxury';

export interface CreateClientDto {
  groomName: string;
  brideName: string;
  groomPhone: string;
  bridePhone?: string;
  email?: string;
  address?: string;
  budget: number;
}

// ===== BOOKING =====
export interface Booking {
  id: number;
  clientId: number;
  client?: Client;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  guestCount: number;
  eventType: EventType;
  status: BookingStatus;
  totalAmount: number;
  notes?: string;
  services?: BookingService[];
  payments?: Payment[];
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';
export type EventType = 'FullWedding' | 'Cocktail' | 'Engagement' | 'SmallParty';

export interface CreateBookingDto {
  clientId: number;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  guestCount: number;
  eventType: EventType;
  notes?: string;
  serviceIds?: number[];
}

export interface BookingService {
  serviceId: number;
  serviceName: string;
  vendorId?: number;
  vendorName?: string;
  price: number;
}

// ===== SERVICE PROVIDER =====
export interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  phone: string;
  capacity: string;
  priceFrom: string;
  emoji: string;
  badge?: string;
  packages?: VendorPackage[];
  reviews?: VendorReview[];
}

export interface VendorPackage {
  id: number;
  name: string;
  price: string;
  details: string;
}

export interface VendorReview {
  id: number;
  reviewerName: string;
  stars: number;
  text: string;
  createdAt: string;
}

// ===== PAYMENT =====
export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'BankTransfer' | 'InstaPay' | 'Card';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

// ===== DASHBOARD =====
export interface DashboardStats {
  totalBookings: number;
  bookingsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalClients: number;
  averageRating: number;
  recentBookings: Booking[];
  recentActivities: Activity[];
}

export interface Activity {
  text: string;
  time: string;
  type: 'booking' | 'payment' | 'client' | 'review';
}

// ===== AUTH =====
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  username: string;
  role: string;
  user?: {
    username: string;
    role: string;
  };
}

// ===== PAGINATION =====
export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
  [key: string]: any;
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  description?: string;
  phone?: string;
  isActive: boolean;
}
