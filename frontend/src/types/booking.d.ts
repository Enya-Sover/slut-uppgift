

type NewBooking = {
    check_in_date: string;
    check_out_date: string;
}
type BookingResponse = {
    data: any[];
    count: number;
    offset: number;
    limit: number;
}