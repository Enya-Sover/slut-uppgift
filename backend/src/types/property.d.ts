


interface NewProperty {
    name: string;
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
    owner_id: string;
}
interface Property extends NewProperty {
    id: string;
    created_at: string;
}

type PropertyListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: "name"
  };