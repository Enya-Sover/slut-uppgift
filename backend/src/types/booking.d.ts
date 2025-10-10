


interface NewBooking {
    check_in_date: string;   
    check_out_date: string;  
    total_price: number;
    user_id: string;
    property_id: string;
  }
  
  interface Booking extends NewBooking {
    id: string;
    created_at: string;
  }
  
  type BookingListQuery = {
    limit?: number;
    offset?: number;
    property_id?: string;
    user_id?: string;
  };
  