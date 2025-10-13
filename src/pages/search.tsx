import { Header } from "../components/Header";
import { MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import type { Petshop } from "../types/petshop";
import type { ApidogModel } from "../types/api";
import { mapApiToPetshop } from "../mappers/petshopMapper";
import { companyCache } from "../lib/services/company-cache";
import { apiClient } from "../lib/api-client";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q") || "";

  const [location, setLocation] = useState("");
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [rating, setRating] = useState("qualquer");

  const [results, setResults] = useState<Petshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [applyFiltersTrigger, setApplyFiltersTrigger] = useState(0);

  // Captura a localização do usuário (ou padrão)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setCoords({ lat: -23.5505, lng: -46.6333 })
      );
    } else {
      setCoords({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Busca resultados usando apiClient
  useEffect(() => {
    if (!coords) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<ApidogModel>('/companies/search', {
          params: {
            query: searchQuery,
            latitude: coords.lat,
            longitude: coords.lng,
            radiusInKm: 50,
            page: 1,
            limit: 20,
            ...(rating !== 'qualquer' && { minRating: rating }),
            ...(animalTypes.length > 0 && { animals: animalTypes.join(',') }),
            ...(location.trim() && { location: location.trim() }),
          },
        });

        if (data.items && data.items.length > 0) {
          const mappedPetshops = data.items.map(mapApiToPetshop);
          mappedPetshops.forEach(petshop => companyCache.setCompany(petshop.id, petshop));
          setResults(mappedPetshops);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, coords, animalTypes, rating, location, applyFiltersTrigger]);

  const handleAnimalChange = (type: string) => {
    setAnimalTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    // Atualiza o estado para disparar o useEffect
    setApplyFiltersTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={true} />
      <main className="container mx-auto px-4 py-12 flex gap-8">
        {/* Filtros */}
        <aside className="w-80 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

          {/* Localização */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cidade ou CEP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
            </div>
          </div>

          {/* Tipo de Animal */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Tipo de Animal</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              {["Cachorro", "Gato", "Outros"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={animalTypes.includes(type)}
                    onChange={() => handleAnimalChange(type)}
                    className="accent-yellow-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Avaliação */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Avaliação</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  value="4.5"
                  checked={rating === "4.5"}
                  onChange={(e) => setRating(e.target.value)}
                  className="accent-yellow-500"
                />
                4.5+ <Star className="w-4 h-4 text-yellow-400" />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  value="4.0"
                  checked={rating === "4.0"}
                  onChange={(e) => setRating(e.target.value)}
                  className="accent-yellow-500"
                />
                4.0+ <Star className="w-4 h-4 text-yellow-400" />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  value="qualquer"
                  checked={rating === "qualquer"}
                  onChange={(e) => setRating(e.target.value)}
                  className="accent-yellow-500"
                />
                Qualquer Avaliação
              </label>
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-full hover:bg-yellow-600 transition"
          >
            Aplicar Filtros
          </button>
        </aside>

        {/* Resultados */}
        <section className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os resultados"}
            </h2>
            <p className="text-gray-600 mt-1">
              {loading
                ? "Buscando..."
                : `${results.length} ${results.length === 1 ? "resultado encontrado" : "resultados encontrados"}`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">Carregando resultados...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-lg">Nenhum resultado encontrado</p>
              <p className="text-gray-400 mt-2">Tente ajustar os filtros ou fazer uma nova busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((petshop) => (
                <div
                  key={petshop.id}
                  onClick={() => navigate(`/empresa/${petshop.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={petshop.image || "https://via.placeholder.com/400x200"}
                    alt={petshop.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{petshop.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{petshop.location || "Endereço não disponível"}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {petshop.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({petshop.reviews || 0} {petshop.reviews === 1 ? "avaliação" : "avaliações"})
                      </span>
                    </div>
                    {petshop.distance && (
                      <p className="text-sm text-gray-600">A {petshop.distance} de você</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
