import { useState, useEffect } from "react";
import { X, Upload, User, Plus, Search } from "lucide-react";
import { createAnimal, type CreateAnimalData } from "@/lib/services/animals";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms/session";
import { useBreedSearch } from "@/hooks/use-breeds";
import { allBreeds } from "@/data/breeds";
import { toast } from "sonner";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPetModal({ isOpen, onClose, onSuccess }: AddPetModalProps) {
  const user = useAtomValue(sessionAtom);
  const { searchResults, isSearching, search, clearSearch } = useBreedSearch();
  const [formData, setFormData] = useState<CreateAnimalData>({
    name: "",
    breed: "Selecione uma raça...",
    age: "",
    image: "",
    userId: user?.id
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [breedSearchQuery, setBreedSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ""}));
    }
  };

  const handleBreedSearch = (query: string) => {
    setBreedSearchQuery(query);
    if (query.trim()) {
      search(query);
      setShowBreedDropdown(true);
    } else {
      clearSearch();
      setShowBreedDropdown(false);
    }
  };

  const handleBreedSelect = (breedName: string) => {
    setFormData(prev => ({...prev, breed: breedName}));
    setBreedSearchQuery(breedName);
    setShowBreedDropdown(false);
    clearSearch();
  };

  const handleBreedInputFocus = () => {
    setShowBreedDropdown(true);
    // Se não há query, mostrar raças locais como fallback
    if (!breedSearchQuery.trim()) {
      // Não fazer busca, apenas mostrar dropdown
    }
  };

  const handleBreedInputBlur = () => {
    // Delay para permitir cliques nos resultados
    setTimeout(() => {
      setShowBreedDropdown(false);
    }, 200);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    // Validação da raça - verifica tanto formData.breed quanto breedSearchQuery
    const selectedBreed = breedSearchQuery || formData.breed;
    if (!selectedBreed.trim() || selectedBreed === "Selecione uma raça...") {
      newErrors.breed = "Raça é obrigatória";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Idade é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await createAnimal({
        ...formData,
        breed: breedSearchQuery || formData.breed, // Usa a raça selecionada
        userId: user?.id
      });
      
      setFormData({
        name: "",
        breed: "Selecione uma raça...",
        age: "",
        image: "",
        userId: user?.id
      });
      
      toast.success('Pet criado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar pet:', error);
      toast.error(error.message || 'Erro ao criar pet. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      breed: "Selecione uma raça...",
      age: "",
      image: "",
      userId: user?.id
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Adicionar Pet</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Pet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Rex, Mia, Luna..."
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="relative">
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
            Raça *
          </label>
          <div className="relative">
            <input
              type="text"
              id="breed"
              name="breed"
              value={breedSearchQuery || formData.breed}
              onChange={(e) => handleBreedSearch(e.target.value)}
              onFocus={handleBreedInputFocus}
              onBlur={handleBreedInputBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.breed ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite para buscar uma raça..."
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {showBreedDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-gray-500">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Buscando raças...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((breed) => (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => handleBreedSelect(breed.name)}
                    className="w-full px-3 py-2 text-left hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{breed.name}</div>
                    {breed.species && (
                      <div className="text-sm text-gray-500">{breed.species}</div>
                    )}
                  </button>
                ))
              ) : breedSearchQuery.trim() ? (
                <div className="p-3 text-center text-gray-500">
                  Nenhuma raça encontrada
                </div>
              ) : (
                // Mostrar raças locais como fallback
                allBreeds.slice(1).map((breed) => (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => handleBreedSelect(breed)}
                    className="w-full px-3 py-2 text-left hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{breed}</div>
                  </button>
                ))
              )}
            </div>
          )}
          
          {errors.breed && <p className="text-red-500 text-sm mt-1">{errors.breed}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Idade *
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 2 anos, 6 meses, 1 ano..."
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem (Opcional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        {formData.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview da Imagem
            </label>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <User className="w-8 h-8 text-gray-400 hidden" />
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Criando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Criar Pet
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
