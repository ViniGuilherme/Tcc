import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAtom } from "jotai";
import { MapPin, Star, Clock, Phone, Heart, ChevronDown, MessageSquare } from "lucide-react";
import { Header } from "../components/Header";
import type { CompanyDetails } from "../types/petshop";
import { fetchCompanyDetails } from "../lib/services/service-details";
import { CustomDatePicker } from "../components/ui/date-picker";
import { CreateRatingModal } from "../components/CreateRatingModal";
import { RatingsList } from "../components/RatingsList";
import { sessionAtom } from "../lib/atoms/session";
import { useAuthInit } from "../hooks/use-auth-init";



export function ServiceDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [session] = useAtom(sessionAtom);
  
  // Inicializar autenticação
  useAuthInit();

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company-details', companyId],
    queryFn: () => fetchCompanyDetails(companyId!),
    enabled: !!companyId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes da empresa...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar a empresa</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Fachada da empresa</span>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Área interna</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{company.rating}</span>
                  <span className="text-gray-600">({company.reviews} avaliações)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Sobre a empresa</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{company.description}</p>
                
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{company.address.addressLine}</span>
                  </div>
                  {company.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">{company.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    Avaliações
                  </h2>
                  {session && (
                    <button
                      onClick={() => setIsRatingModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Avaliar
                    </button>
                  )}
                </div>
                
                <RatingsList 
                  companyId={companyId!} 
                  onRatingCreated={() => {
                    // Recarregar avaliações se necessário
                  }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Serviços Disponíveis</h2>
                <div className="grid grid-cols-1 gap-4">
                  {company.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-lg font-bold text-yellow-600">
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} minutos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{company.rating}</span>
                  <span className="text-sm text-gray-600">({company.reviews} avaliações)</span>
                </div>
                <p className="text-sm text-gray-600">{company.location}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <CustomDatePicker
                    selectedDate={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="Selecione uma data"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                  <div className="relative">
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Selecione um serviço</option>
                      {company.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2).replace('.', ',')}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                  <div className="relative">
                    <select 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Selecione um horário</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (selectedDate && selectedService && selectedTime) {
                    navigate('/agendamento');
                  } else {
                    alert('Por favor, preencha todos os campos para agendar o serviço.');
                  }
                }}
                disabled={!selectedDate || !selectedService || !selectedTime}
                className={`w-full py-3 rounded-lg font-medium transition-colors mb-3 ${
                  selectedDate && selectedService && selectedTime
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Agendar Serviço
              </button>

              <p className="text-xs text-gray-500 text-center mb-4">
                Você não será cobrado ainda.
              </p>

              <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Heart className="w-4 h-4" />
                Salvar nos favoritos
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">PetGrooming</h3>
              <p className="text-gray-400">Conectando pets aos melhores cuidados.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Para Clientes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Buscar Serviços</a></li>
                <li><a href="#" className="hover:text-white">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-white">Login</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Para Empresas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Cadastre seu negócio</a></li>
                <li><a href="#" className="hover:text-white">Login Parceiro</a></li>
                <li><a href="#" className="hover:text-white">Vantagens</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Siga-nos</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">📷</a>
                <a href="#" className="text-gray-400 hover:text-white">📘</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 PetGrooming. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <CreateRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSuccess={() => {
          setIsRatingModalOpen(false);
          // Recarregar avaliações se necessário
        }}
        companyId={companyId!}
        companyName={company?.name || ''}
      />
    </div>
  );
}
