import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { SearchSection } from "../components/home/SearchSection";
import { RecommendedSection } from "../components/home/RecommendedSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { Footer } from "../components/home/Footer";

import type { Petshop } from "../types/petshop";
import type { ApidogModel } from "../types/api";
import { mapApiToPetshop } from "../mappers/petshopMapper";
import { companyCache } from "../lib/services/company-cache";

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedPetshops, setRecommendedPetshops] = useState<Petshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setCoords({ lat: -23.5505, lng: -46.6333 }) 
      );
    } else {
      setCoords({ lat: -23.5505, lng: -46.6333 }); 
    }
  }, []);

  useEffect(() => {
    const fetchPetshops = async () => {
      if (!coords) {
        return;
      }

      setLoading(true);
      try {
        const url = `https://pet-api-2may.onrender.com/companies/search?query=&latitude=${coords.lat}&longitude=${coords.lng}&radiusInKm=10&page=1&limit=8`;
        
        const response = await fetch(url);
        
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApidogModel = await response.json();
        
        if (data.items && data.items.length > 0) {
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
  }, [coords]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/resultados?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-8 py-4 bg-yellow-400">
        <h1 className="text-xl font-bold">
          <span className="text-white">Pet</span>
          <span className="text-black">Grooming</span>
        </h1>
        <nav className="flex gap-6 text-sm text-gray-800 font-medium">
          <button 
            onClick={() => navigate('/for-companies')}
            className="hover:text-gray-600"
          >
            Para Empresas
          </button>
          <button 
            onClick={() => navigate('/sobre-nos')}
            className="hover:text-gray-600"
          >
            Sobre nós
          </button>
          <button 
            onClick={() => navigate('/contato')}
            className="hover:text-gray-600"
          >
            Contato
          </button>
          <button 
            onClick={() => navigate('/busca')}
            className="hover:text-gray-600"
          >
            Buscar
          </button>
        </nav>
        <div className="flex gap-3">
          <a href="#">
            <button className="text-gray-700 font-medium">Login</button>
          </a>
          <button className="bg-white text-yellow-500 font-bold px-4 py-1 rounded-full">
            Cadastre-se
          </button>
        </div>
      </header>
      <section className="bg-gray-700 text-center text-white py-14 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Encontre os melhores serviços para o seu pet
        </h2>
        <p className="text-lg mb-8">
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