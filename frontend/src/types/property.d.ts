
type NewProperty = {
    id: string;
    name: string;
    image_url?: string;
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
}
type Property = {
    id: string;
    name: string;
    image_url: string;
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
}

type PropertyData = {
    name: string;
    image_url?: string;
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
  };