

interface NewBooking {
    check_in_date: string;
    check_out_date: string;
}

interface Booking extends NewBooking {
    user_id: string,
    id: string,
    property_id: string,
    total_price: number,
}

type BookingResponse = {
    data: any[];
    count: number;
    offset: number;
    limit: number;
}

type BookingWithProperty = {
    id: string;
    property_id: string;
    user_id: string;
    check_in_date: string;
    check_out_date: string;
    total_price?: number;
    property?: Property;
  };