

interface Property {
    id: string,
    description: string,
    location: string,
    pricePerNight: number,
    availability: boolean
}

type PropertyListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: "name"
  };