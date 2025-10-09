import { useNavigate } from "react-router";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";

export function SearchPage() {
  const navigate = useNavigate();

  // Estados dos filtros
  const [location, setLocation] = useState("");
  const [animalTypes, setAnimalTypes] = useState<string[]>(["Cachorro"]);
  const [rating, setRating] = useState("qualquer");

  const handleAnimalChange = (type: string) => {
    setAnimalTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    console.log({
      location,
      animalTypes,
      rating,
    });
    alert("Filtros aplicados!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-yellow-500 font-bold text-xl"
            >
              PetGrooming
            </button>
            <nav className="flex gap-6 text-sm text-gray-700">
              <button onClick={() => navigate('/for-companies')} className="hover:text-yellow-500">
                Para Empresas
              </button>
              <button onClick={() => navigate('/sobre-nos')} className="hover:text-yellow-500">
                Sobre nós
              </button>
              <button onClick={() => navigate('/contato')} className="hover:text-yellow-500">
                Contato
              </button>
              <button
                onClick={() => navigate('/busca')}
                className="hover:text-yellow-500 text-yellow-600 font-medium"
              >
                Buscar
              </button>
            </nav>
            <div className="flex gap-3">
              <button className="text-gray-700 font-medium">Login</button>
              <button className="bg-yellow-500 text-white font-bold px-4 py-1 rounded-full hover:bg-yellow-600">
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-12 flex gap-8">
        {/* Filtros */}
        <aside className="w-80 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

          {/* Localização */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localização
            </label>
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
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Tipo de Animal
            </h3>
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
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Avaliação
            </h3>
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

          {/* Botão Aplicar */}
          <button
            onClick={handleApplyFilters}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-full hover:bg-yellow-600 transition"
          >
            Aplicar Filtros
          </button>
        </aside>

        {/* Área de resultados */}
        <section className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Resultados aparecerão aqui...</p>
        </section>
      </main>
    </div>
  );
}
 