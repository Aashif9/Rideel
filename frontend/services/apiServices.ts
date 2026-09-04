import {
  getInitialDatabase, saveDatabase, AppDatabase
} from './store';
import {
  User, Trip, Parcel, Delivery, MatchRequest, Payment,
  WalletTransaction, Review, Message, AppNotification, Dispute,
  KYCVerification, Vehicle, BulkShipment, UserMode
} from '@/types';
import { calculateMatchScore } from '@/lib/matching/engine';
import { canTransitionDeliveryStatus } from '@/lib/state-machine/delivery';
import { FEE_CONFIG } from '@/lib/constants';

class RideelServices {
  private getDb(): AppDatabase {
    const db = getInitialDatabase();
    if (!db.currentUser) {
      db.currentUser = {
        id: 'usr_guest_session',
        full_name: 'Guest User',
        phone: '9000000000',
        email: 'guest@rideel.in',
        profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        city: 'Chennai',
        rating: 5.0,
        completed_deliveries: 0,
        role: ['sender', 'traveler'],
        active_mode: 'sender',
        account_status: 'active',
        is_kyc_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return db;
  }

  private saveDb(db: AppDatabase) {
    saveDatabase(db);
  }

  // --- AUTH & USER SERVICE ---
  async getCurrentUser(): Promise<User> {
    const db = this.getDb();
    return db.currentUser;
  }

  async switchUserMode(newMode: UserMode): Promise<User> {
    const db = this.getDb();
    if (db.currentUser) {
      db.currentUser.active_mode = newMode;
      const idx = db.users.findIndex(u => u.id === db.currentUser.id);
      if (idx !== -1) db.users[idx].active_mode = newMode;
      this.saveDb(db);
    }
    return db.currentUser;
  }

  async switchPresetUser(userId: string): Promise<User> {
    const db = this.getDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      db.currentUser = user;
      this.saveDb(db);
      return user;
    }
    return db.currentUser;
  }

  private getAuthBaseUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  /**
   * Request MSG91 OTP from backend Express API
   */
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${this.getAuthBaseUrl()}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      return {
        success: data.success ?? (res.status >= 200 && res.status < 300),
        message: data.message || 'OTP request processed.'
      };
    } catch (err) {
      return { success: false, message: 'Network error connecting to authentication server.' };
    }
  }

  /**
   * Resend MSG91 OTP respecting backend 60s cooldown
   */
  async resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${this.getAuthBaseUrl()}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      return {
        success: data.success ?? (res.status >= 200 && res.status < 300),
        message: data.message || 'Resend request processed.'
      };
    } catch (err) {
      return { success: false, message: 'Network error requesting OTP resend.' };
    }
  }

  /**
   * Verify MSG91 OTP code and establish JWT authenticated session
   */
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; isNewUser?: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch(`${this.getAuthBaseUrl()}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        if (data.tokens) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('rideel_access_token', data.tokens.accessToken);
            localStorage.setItem('rideel_refresh_token', data.tokens.refreshToken);
          }
        }
        const db = this.getDb();
        db.currentUser = data.user;
        const idx = db.users.findIndex(u => u.id === data.user.id);
        if (idx !== -1) {
          db.users[idx] = data.user;
        } else {
          db.users.push(data.user);
        }
        this.saveDb(db);
        return { success: true, isNewUser: data.isNewUser, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'OTP verification failed.' };
      }
    } catch (err) {
      return { success: false, message: 'Network error verifying OTP.' };
    }
  }

  async loginWithOTP(phone: string, otp: string, userData?: { full_name?: string; email?: string; city?: string; role?: string[] }): Promise<{ success: boolean; isNewUser?: boolean; user?: User; message?: string }> {
    return this.verifyOTP(phone, otp);
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('rideel_refresh_token') : null;
      if (refreshToken) {
        await fetch(`${this.getAuthBaseUrl()}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rideel_access_token');
      localStorage.removeItem('rideel_refresh_token');
    }
    return { success: true };
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    const db = this.getDb();
    db.currentUser = { ...db.currentUser, ...updates, updated_at: new Date().toISOString() };
    const idx = db.users.findIndex(u => u.id === db.currentUser.id);
    if (idx !== -1) db.users[idx] = db.currentUser;
    this.saveDb(db);

    // Sync profile updates to PostgreSQL Database
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/auth/register-or-login` : `${baseUrl}/api/auth/register-or-login`;

      await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: db.currentUser.phone,
          full_name: updates.full_name || db.currentUser.full_name,
          email: updates.email || db.currentUser.email,
          city: updates.city || db.currentUser.city,
          role: updates.role || db.currentUser.role
        })
      });
    } catch (e) {
      console.warn('Could not sync user profile update to PostgreSQL backend:', e);
    }

    return db.currentUser;
  }

  // --- TRIP SERVICE ---
  async postTrip(tripData: Omit<Trip, 'id' | 'created_at' | 'traveler_id' | 'available_capacity_kg' | 'status'>): Promise<Trip> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
      traveler_id: userId,
      available_capacity_kg: tripData.capacity_kg,
      status: 'POSTED',
      created_at: new Date().toISOString(),
      traveler: db.currentUser
    };
    db.trips.unshift(newTrip);
    this.saveDb(db);
    return newTrip;
  }

  async getTrips(filters?: { origin?: string; destination?: string; date?: string }): Promise<Trip[]> {
    const db = this.getDb();
    return db.trips.filter(t => {
      if (t.status !== 'POSTED' && t.status !== 'ACTIVE') return false;
      if (filters?.origin && t.origin.toLowerCase() !== filters.origin.toLowerCase()) return false;
      if (filters?.destination && t.destination.toLowerCase() !== filters.destination.toLowerCase()) return false;
      return true;
    }).map(t => ({
      ...t,
      traveler: db.users.find(u => u.id === t.traveler_id) || t.traveler
    }));
  }

  async getTripById(id: string): Promise<Trip | undefined> {
    const db = this.getDb();
    const trip = db.trips.find(t => t.id === id);
    if (trip) {
      trip.traveler = db.users.find(u => u.id === trip.traveler_id) || trip.traveler;
    }
    return trip;
  }

  // --- PARCEL & MATCHING SERVICE ---
  async createParcel(parcelData: Omit<Parcel, 'id' | 'created_at' | 'sender_id' | 'status'>): Promise<Parcel> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    const newParcel: Parcel = {
      ...parcelData,
      id: `pcl_${Date.now()}`,
      sender_id: userId,
      status: 'SEARCHING',
      created_at: new Date().toISOString(),
      sender: db.currentUser
    };
    db.parcels.unshift(newParcel);
    this.saveDb(db);
    return newParcel;
  }

  async findMatchingTravelers(parcelId: string): Promise<Array<{ trip: Trip; match_score: number; reasons: string[] }>> {
    const db = this.getDb();
    const parcel = db.parcels.find(p => p.id === parcelId);
    if (!parcel) return [];

    const activeTrips = db.trips.filter(t => t.status === 'POSTED' && t.available_capacity_kg >= parcel.weight_kg);
    
    return activeTrips.map(trip => {
      const fullTrip = { ...trip, traveler: db.users.find(u => u.id === trip.traveler_id) || trip.traveler };
      const scoreResult = calculateMatchScore(parcel, fullTrip);
      return {
        trip: fullTrip,
        match_score: scoreResult.match_score,
        reasons: scoreResult.reasons
      };
    }).sort((a, b) => b.match_score - a.match_score);
  }

  // --- BOOKING & DELIVERY LIFECYCLE SERVICE ---
  async createBooking(parcelId: string, tripId: string): Promise<{ delivery: Delivery; matchRequest: MatchRequest }> {
    const db = this.getDb();
    const parcel = db.parcels.find(p => p.id === parcelId);
    const trip = db.trips.find(t => t.id === tripId);

    if (!parcel || !trip) throw new Error('Parcel or Trip not found');

    if (trip.available_capacity_kg < parcel.weight_kg) {
      throw new Error('Traveler does not have sufficient capacity remaining');
    }

    const matchRequest: MatchRequest = {
      id: `mr_${Date.now()}`,
      parcel_id: parcelId,
      trip_id: tripId,
      sender_id: parcel.sender_id,
      traveler_id: trip.traveler_id,
      match_score: 95,
      status: 'ACCEPTED',
      created_at: new Date().toISOString()
    };
    db.matchRequests.push(matchRequest);

    // Calculate Fees
    const deliveryFee = Math.round(parcel.weight_kg * trip.price_per_kg + 50);
    const serviceFee = FEE_CONFIG.SERVICE_FEE_FLAT;
    const insuranceFee = parcel.insurance_selected ? FEE_CONFIG.INSURANCE_BASIC_FEE : 0;
    const totalAmount = deliveryFee + serviceFee + insuranceFee;
    const travelerPayout = deliveryFee;

    // Generate random 6-digit OTPs
    const pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const delivery: Delivery = {
      id: `RD${Math.floor(100000 + Math.random() * 900000)}`,
      parcel_id: parcelId,
      trip_id: tripId,
      traveler_id: trip.traveler_id,
      sender_id: parcel.sender_id,
      pickup_location: `${parcel.origin} City Center`,
      delivery_location: `${parcel.destination} Central Station`,
      expected_delivery_time: trip.estimated_arrival,
      status: 'BOOKED',
      delivery_fee: deliveryFee,
      service_fee: serviceFee,
      insurance_fee: insuranceFee,
      total_amount: totalAmount,
      traveler_payout: travelerPayout,
      pickup_otp: pickupOtp,
      delivery_otp: deliveryOtp,
      created_at: new Date().toISOString(),
      parcel,
      trip,
      sender: db.users.find(u => u.id === parcel.sender_id),
      traveler: db.users.find(u => u.id === trip.traveler_id)
    };

    // Reserve Capacity
    trip.available_capacity_kg -= parcel.weight_kg;
    parcel.status = 'BOOKED';
    db.deliveries.unshift(delivery);

    // Notify Traveler
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: trip.traveler_id,
      title: 'New Parcel Request Accepted!',
      message: `You have been paired with parcel ${delivery.id} (${parcel.weight_kg} kg) for ₹${travelerPayout}.`,
      type: 'MATCH_REQUEST',
      read: false,
      delivery_id: delivery.id,
      created_at: new Date().toISOString()
    });

    this.saveDb(db);
    return { delivery, matchRequest };
  }

  async processDemoPayment(deliveryId: string): Promise<Payment> {
    const db = this.getDb();
    const delivery = db.deliveries.find(d => d.id === deliveryId);
    if (!delivery) throw new Error('Delivery record not found');

    const payment: Payment = {
      id: `pay_${Date.now()}`,
      delivery_id: deliveryId,
      sender_id: delivery.sender_id,
      traveler_id: delivery.traveler_id,
      amount: delivery.total_amount,
      platform_fee: delivery.service_fee,
      insurance_fee: delivery.insurance_fee,
      traveler_payout: delivery.traveler_payout,
      status: 'ESCROW_HELD',
      provider: 'DEMO_SIMULATION',
      transaction_reference: `SIM-ESCROW-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    db.payments.unshift(payment);

    // Create Wallet Escrow Hold for Traveler
    db.walletTransactions.unshift({
      id: `wtx_${Date.now()}`,
      user_id: delivery.traveler_id,
      delivery_id: deliveryId,
      type: 'ESCROW_HOLD',
      amount: delivery.traveler_payout,
      status: 'ESCROW',
      description: `Escrow Hold for Delivery ${deliveryId}`,
      created_at: new Date().toISOString()
    });

    delivery.status = 'ACCEPTED';
    this.saveDb(db);
    return payment;
  }

  async verifyPickupOTP(deliveryId: string, otp: string): Promise<{ success: boolean; message: string }> {
    const db = this.getDb();
    const delivery = db.deliveries.find(d => d.id === deliveryId);
    if (!delivery) return { success: false, message: 'Delivery not found' };

    if (otp !== delivery.pickup_otp) {
      return { success: false, message: 'Incorrect Pickup OTP code.' };
    }

    delivery.status = 'PICKED_UP';
    delivery.pickup_time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update parcel status
    const parcel = db.parcels.find(p => p.id === delivery.parcel_id);
    if (parcel) parcel.status = 'PICKED_UP';

    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: delivery.sender_id,
      title: 'Parcel Picked Up!',
      message: `Traveler has verified the Pickup OTP and parcel ${delivery.id} is now in transit.`,
      type: 'OTP_ALERT',
      read: false,
      delivery_id: delivery.id,
      created_at: new Date().toISOString()
    });

    this.saveDb(db);
    return { success: true, message: 'Pickup OTP verified successfully. Parcel is marked IN_TRANSIT.' };
  }

  async verifyDeliveryOTP(deliveryId: string, otp: string): Promise<{ success: boolean; message: string }> {
    const db = this.getDb();
    const delivery = db.deliveries.find(d => d.id === deliveryId);
    if (!delivery) return { success: false, message: 'Delivery not found' };

    if (otp !== delivery.delivery_otp) {
      return { success: false, message: 'Incorrect Delivery OTP code.' };
    }

    delivery.status = 'DELIVERED';
    delivery.actual_delivery_time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update parcel
    const parcel = db.parcels.find(p => p.id === delivery.parcel_id);
    if (parcel) parcel.status = 'DELIVERED';

    // Release Escrow Payment to Traveler Wallet
    const payment = db.payments.find(p => p.delivery_id === deliveryId);
    if (payment) payment.status = 'RELEASED';

    db.walletTransactions.unshift({
      id: `wtx_${Date.now()}`,
      user_id: delivery.traveler_id,
      delivery_id: deliveryId,
      type: 'EARNING_CREDIT',
      amount: delivery.traveler_payout,
      status: 'RELEASED',
      description: `Delivery ${deliveryId} Payout Released`,
      created_at: new Date().toISOString()
    });

    // Update Traveler completed deliveries
    const traveler = db.users.find(u => u.id === delivery.traveler_id);
    if (traveler) traveler.completed_deliveries += 1;

    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: delivery.sender_id,
      title: 'Parcel Delivered Successfully! 🎉',
      message: `Parcel ${delivery.id} has been delivered. Tap to rate your traveler.`,
      type: 'TRIP_UPDATE',
      read: false,
      delivery_id: delivery.id,
      created_at: new Date().toISOString()
    });

    this.saveDb(db);
    return { success: true, message: 'Delivery OTP verified. Payout released to traveler wallet!' };
  }

  async submitReview(reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const db = this.getDb();
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      created_at: new Date().toISOString(),
      reviewer: db.users.find(u => u.id === reviewData.reviewer_id)
    };
    db.reviews.push(newReview);
    this.saveDb(db);
    return newReview;
  }

  // --- CHAT SERVICE ---
  async getMessages(deliveryId: string): Promise<Message[]> {
    const db = this.getDb();
    return db.messages.filter(m => m.delivery_id === deliveryId).map(m => ({
      ...m,
      sender: db.users.find(u => u.id === m.sender_id)
    }));
  }

  async sendMessage(deliveryId: string, messageText: string): Promise<Message> {
    const db = this.getDb();
    const delivery = db.deliveries.find(d => d.id === deliveryId);
    const userId = db.currentUser?.id || 'usr_guest_session';
    const receiverId = delivery ? (userId === delivery.sender_id ? delivery.traveler_id : delivery.sender_id) : '';

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      delivery_id: deliveryId,
      sender_id: userId,
      receiver_id: receiverId,
      message: messageText,
      created_at: new Date().toISOString(),
      sender: db.currentUser
    };
    db.messages.push(newMsg);
    this.saveDb(db);
    return newMsg;
  }

  // --- WALLET & PAYOUT SERVICE ---
  async getWalletData(userId: string): Promise<{ available: number; escrow: number; transactions: WalletTransaction[] }> {
    const db = this.getDb();
    const userTxns = db.walletTransactions.filter(t => t.user_id === userId);
    
    let available = 0;
    let escrow = 0;

    userTxns.forEach(t => {
      if (t.status === 'RELEASED') available += t.amount;
      if (t.status === 'ESCROW') escrow += t.amount;
      if (t.status === 'WITHDRAWN') available -= t.amount;
    });

    return { available: Math.max(0, available), escrow, transactions: userTxns };
  }

  async requestWithdrawal(amount: number, bankDetails: string): Promise<{ success: boolean; message: string }> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    const wallet = await this.getWalletData(userId);

    if (amount > wallet.available) {
      return { success: false, message: 'Insufficient available balance' };
    }

    db.walletTransactions.unshift({
      id: `wtx_${Date.now()}`,
      user_id: userId,
      type: 'WITHDRAWAL',
      amount,
      status: 'WITHDRAWN',
      description: `Bank Withdrawal to ${bankDetails}`,
      created_at: new Date().toISOString()
    });

    this.saveDb(db);
    return { success: true, message: `Successfully requested payout of ₹${amount}!` };
  }

  // --- KYC SERVICE ---
  async submitKYC(documentType: any, documentNumber: string, documentUrl: string, selfieUrl: string): Promise<KYCVerification> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    const kyc: KYCVerification = {
      id: `kyc_${Date.now()}`,
      user_id: userId,
      document_type: documentType,
      document_number: documentNumber,
      document_url: documentUrl,
      selfie_url: selfieUrl,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    db.kycVerifications.unshift(kyc);
    this.saveDb(db);
    return kyc;
  }

  // --- B2B BUSINESS SERVICE ---
  async createBulkShipment(data: Omit<BulkShipment, 'id' | 'created_at' | 'business_id' | 'status'>): Promise<BulkShipment> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    const bulk: BulkShipment = {
      ...data,
      id: `blk_${Date.now()}`,
      business_id: userId,
      status: 'PROCESSING',
      created_at: new Date().toISOString()
    };
    db.bulkShipments.unshift(bulk);
    this.saveDb(db);
    return bulk;
  }

  // --- ADMIN SERVICE ---
  async getAdminStats() {
    const db = this.getDb();
    const totalUsers = db.users.length;
    const activeTravelers = db.users.filter(u => u.role.includes('traveler')).length;
    const activeDeliveries = db.deliveries.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length;
    const todayRevenue = db.payments.reduce((acc, p) => acc + p.platform_fee, 0);

    return {
      totalUsers,
      activeTravelers,
      activeDeliveries,
      todayRevenue,
      deliveries: db.deliveries,
      users: db.users,
      kycVerifications: db.kycVerifications,
      disputes: db.disputes,
      payments: db.payments
    };
  }

  async adminReviewKYC(kycId: string, status: 'VERIFIED' | 'REJECTED'): Promise<void> {
    const db = this.getDb();
    const kyc = db.kycVerifications.find(k => k.id === kycId);
    if (kyc) {
      kyc.status = status;
      kyc.reviewed_by = db.currentUser?.id || 'usr_admin_1';
      kyc.reviewed_at = new Date().toISOString();
      const user = db.users.find(u => u.id === kyc.user_id);
      if (user && status === 'VERIFIED') user.is_kyc_verified = true;
      this.saveDb(db);
    }
  }

  async adminResolveDispute(disputeId: string, resolution: string): Promise<void> {
    const db = this.getDb();
    const dispute = db.disputes.find(d => d.id === disputeId);
    if (dispute) {
      dispute.status = 'RESOLVED';
      dispute.resolution = resolution;
      this.saveDb(db);
    }
  }

  async getDeliveries(): Promise<Delivery[]> {
    const db = this.getDb();
    return db.deliveries.map(d => ({
      ...d,
      parcel: db.parcels.find(p => p.id === d.parcel_id),
      trip: db.trips.find(t => t.id === d.trip_id),
      sender: db.users.find(u => u.id === d.sender_id),
      traveler: db.users.find(u => u.id === d.traveler_id)
    }));
  }

  async getNotifications(): Promise<AppNotification[]> {
    const db = this.getDb();
    const userId = db.currentUser?.id || 'usr_guest_session';
    return db.notifications.filter(n => n.user_id === userId);
  }
}

export const apiServices = new RideelServices();
