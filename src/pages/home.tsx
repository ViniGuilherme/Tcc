import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SearchSection } from "../components/home/SearchSection";
import { RecommendedSection } from "../components/home/RecommendedSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { Footer } from "../components/home/Footer";
import type { Petshop } from "../types/petshop";
import type { ApidogModel } from "../types/api";
import { mapApiToPetshop } from "../mappers/petshopMapper";
import { companyCache } from "../lib/services/company-cache";
import { apiClient } from "../lib/api-client";

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedPetshops, setRecommendedPetshops] = useState<Petshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetshops = async () => {
      setLoading(true);
      
      try {
        const response = await apiClient.get<ApidogModel>('/companies/search', {
          params: {
            page: 1,
            limit: 8
          }
        });
        
        const data = response.data;
        
        if (data && data.items && data.items.length > 0) {
          const mappedPetshops = data.items.map(mapApiToPetshop);
          
          mappedPetshops.forEach(petshop => {
            companyCache.setCompany(petshop.id, petshop);
          });
          
          setRecommendedPetshops(mappedPetshops);
        } else {
          setRecommendedPetshops([]);
        }
      } catch (error) {
        console.error("Erro ao buscar petshops:", error);
        setRecommendedPetshops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPetshops();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm select-none">
        <h1 className="text-xl font-bold cursor-pointer text-yellow-500" onClick={() => navigate('/inicio')}>
          PetGrooming
        </h1>
        <nav className="flex gap-6 text-sm text-gray-800 font-medium">
          <button 
            onClick={() => navigate('/inicio')}
            className="hover:text-gray-600 cursor-pointer"
          >
            Início
          </button>
          <button 
            onClick={() => navigate('/for-companies')}
            className="hover:text-gray-600 cursor-pointer"
          >
            Para Empresas
          </button>
          <button 
            onClick={() => navigate('/sobre-nos')}
            className="hover:text-gray-600 cursor-pointer"
          >
            Sobre nós
          </button>
          <button 
            onClick={() => navigate('/contato')}
            className="hover:text-gray-600 cursor-pointer"
          >
            Contato
          </button>
          <button 
            onClick={() => navigate('/busca')}
            className="hover:text-gray-600 cursor-pointer"
          >
            Buscar
          </button>
        </nav>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/entrar')}
            className="text-gray-700 font-medium cursor-pointer hover:text-gray-600"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/cadastrar')}
            className="bg-yellow-500 text-white font-bold px-4 py-1 rounded-full cursor-pointer hover:bg-yellow-600"
          >
            Cadastre-se
          </button>
        </div>
      </header>
      <section className="bg-yellow-500 text-center py-14 px-6">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Encontre os melhores serviços para o seu pet
        </h2>
        <p className="text-lg mb-8 text-white">
          Descubra, compare e agende banho, tosa e outros cuidados com os
          melhores profissionais da sua região.
        </p>
        <SearchSection 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
        />
      </section>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500">Carregando recomendações...</p>
        ) : (
          <RecommendedSection recommendedPetshops={recommendedPetshops} />
        )}
        <HowItWorksSection />
      </main>

      <Footer />
    </div>
  );
}