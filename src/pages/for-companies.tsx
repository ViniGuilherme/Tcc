import { useState } from "react";
import { Header } from "../components/Header";
import { Building2, MapPin, Clock, Star, Users, CheckCircle, ArrowRight } from "lucide-react";

export function ForCompaniesPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    services: [] as string[],
    workingHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" }
    }
  });

  const availableServices = [
    "Banho e Tosa",
    "Banho",
    "Tosa",
    "Hidratação",
    "Escovação",
    "Corte de Unhas",
    "Limpeza de Ouvidos",
    "Escovação de Dentes",
    "Tratamento Anti-pulgas",
    "Banho Medicinal",
    "Tosa Higiênica",
    "Outros"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro enviado com sucesso! Entraremos em contato em breve para validar suas informações.");
    console.log("Dados da empresa:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header></Header>
      <main>
        <section className="bg-yellow-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">
              Cadastre seu Negócio no PetGrooming
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Conecte-se com milhares de tutores e aumente sua clientela. 
              Faça parte da maior plataforma de agendamento pet do Brasil.
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-yellow-100">Empresas Parceiras</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2.500+</div>
                <div className="text-yellow-100">Pets Atendidos</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-yellow-100">Satisfação</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Por que escolher o PetGrooming?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mais Clientes</h3>
                <p className="text-gray-600">
                  Apareça para milhares de tutores procurando por serviços pet na sua região.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestão Simplificada</h3>
                <p className="text-gray-600">
                  Controle seus agendamentos, horários e disponibilidade em uma única plataforma.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Credibilidade</h3>
                <p className="text-gray-600">
                  Ganhe confiança dos clientes com avaliações e perfil verificado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Cadastre sua Empresa
                </h2>
                <p className="text-gray-600">
                  Preencha os dados abaixo para começar a receber clientes
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-yellow-500" />
                    Informações da Empresa
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Ex: Pet Shop do João"
                      />
                    </div>

                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Responsável *
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="contato@empresa.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição da Empresa *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Conte um pouco sobre sua empresa, experiência e diferenciais..."
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-yellow-500" />
                    Endereço
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Rua, número, bairro"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="00000-000"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PR">Paraná</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="BA">Bahia</option>
                        <option value="GO">Goiás</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="PE">Pernambuco</option>
                        <option value="CE">Ceará</option>
                        <option value="PA">Pará</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="PB">Paraíba</option>
                        <option value="PI">Piauí</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                        <option value="AC">Acre</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Serviços Oferecidos *
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableServices.map((service) => (
                      <label key={service} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    Horário de Funcionamento
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(formData.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                          {day === 'monday' && 'Segunda'}
                          {day === 'tuesday' && 'Terça'}
                          {day === 'wednesday' && 'Quarta'}
                          {day === 'thursday' && 'Quinta'}
                          {day === 'friday' && 'Sexta'}
                          {day === 'saturday' && 'Sábado'}
                          {day === 'sunday' && 'Domingo'}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            name={`workingHours.${day}.open`}
                            value={hours.open}
                            onChange={handleInputChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                          <span className="text-gray-500">até</span>
                          <input
                            type="time"
                            name={`workingHours.${day}.close`}
                            value={hours.close}
                            onChange={handleInputChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Cadastrar Empresa
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Após o cadastro, entraremos em contato para validar suas informações.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="py-16 bg-yellow-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8">
              Junte-se a centenas de empresas que já confiam no PetGrooming
            </p>
            <button 
              onClick={() => navigate('/contato')}
              className="bg-white text-yellow-500 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Fale Conosco
            </button>
          </div>
        </section>
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
    </div>
  );
}
