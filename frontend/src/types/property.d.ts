
type NewProperty = {
    id: string;
    name: string;
    main_image_url?: string;
    image_urls?: string[];
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
}
type Property = {
    id: string;
    name: string;
    main_image_url: string;
    image_urls: string[];
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
}

type PropertyData = {
    name: string;
    main_image_url?: string;
    image_urls?: string[];
    description: string;
    location: string;
    price_per_night: number;
    availability: boolean;
  };