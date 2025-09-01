import type { Petshop } from "../types/petshop";
import type { Item } from "../types/api";

export function mapApiToPetshop(item: Item): Petshop {
  return {
    id: parseInt(item.id, 10) || 0,
    name: item.name,
    image: item.image?.url || "https://via.placeholder.com/300x200",
    location: `${item.address.neighborhood}, ${item.address.city} - ${item.address.state}`,
    distance: "5 km", 
    rating: 4.5,      
    reviews: 10,      
    services: ["Banho", "Tosa"], 
    price: "R$ 50,00", 
  };
}