import { MapPin, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import type { Petshop } from "../../types/petshop";

interface RecommendedSectionProps {
  recommendedPetshops: Petshop[];
}

export function RecommendedSection({ recommendedPetshops }: RecommendedSectionProps) {
  const navigate = useNavigate();
  console.log("RecommendedSection - petshops recebidos:", recommendedPetshops);
  
  if (recommendedPetshops.length === 0) {
    return (
      <div className="mb-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recomendado para você</h3>
        <div className="bg-gray-100 rounded-lg p-8">
          <p className="text-gray-600 text-lg">Nenhum petshop encontrado na sua região.</p>
          <p className="text-gray-500 text-sm mt-2">Tente ajustar sua localização ou expandir o raio de busca.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recomendado para você</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedPetshops.map((petshop) => (
          <div
            key={petshop.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/empresa/${petshop.id}`)}
          >
            <div className="relative">
              <img
                src={petshop.image}
                alt={petshop.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                <Heart className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
                {petshop.distance}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{petshop.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{petshop.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {petshop.location}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="mr-2">({petshop.reviews} avaliações)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">{petshop.price}</span>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                  Agendar
                </button>
              </div>
            </div>
          </div>
        ))}
       </div>

      <div className="mt-6">
        <a
          href="#"
          className="text-yellow-600 font-medium hover:underline transition-colors"
        >
          Ver mais estabelecimentos
        </a>
      </div>
    </div>
  );
}
