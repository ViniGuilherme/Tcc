import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Heart, Award, Shield, Phone, Mail, MapPin } from "lucide-react";

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
              <button 
                onClick={() => navigate('/for-companies')}
                className="hover:text-yellow-500"
              >
                Para Empresas
              </button>
              <button 
                onClick={() => navigate('/sobre-nos')}
                className="hover:text-yellow-500 text-yellow-600 font-medium"
              >
                Sobre nós
              </button>
              <button 
                onClick={() => navigate('/contato')}
                className="hover:text-yellow-500"
              >
                Contato
              </button>
              <button 
                onClick={() => navigate('/busca')}
                className="hover:text-yellow-500"
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

      <section className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Sobre o PetGrooming
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Conectamos pets aos melhores cuidados, facilitando o agendamento de serviços 
            de banho, tosa e outros tratamentos com profissionais qualificados em sua região.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossa Missão</h3>
            <p className="text-gray-600">
              Facilitar o acesso a serviços de qualidade para pets, promovendo 
              o bem-estar animal e a tranquilidade dos tutores.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossa Visão</h3>
            <p className="text-gray-600">
              Ser a principal plataforma de agendamento de serviços pet no Brasil, 
              reconhecida pela qualidade e confiabilidade.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossos Valores</h3>
            <p className="text-gray-600">
              Transparência, qualidade, confiança e amor pelos animais são os 
              pilares que guiam nosso trabalho diário.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                O PetGrooming nasceu como um projeto de Trabalho de Conclusão de Curso (TCC) 
                do curso de Ciências da Computação, fruto da paixão por animais e da necessidade 
                de conectar tutores aos melhores profissionais de cuidados pet. O projeto 
                acadêmico evoluiu para uma plataforma real, fundada em 2024, que resolve um 
                problema comum: a dificuldade de encontrar serviços de qualidade para pets 
                de forma rápida e confiável.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                O que começou como uma pesquisa acadêmica sobre tecnologia e inovação no 
                mercado pet se transformou em uma solução prática e eficiente. Hoje, 
                conectamos milhares de tutores a centenas de profissionais qualificados, 
                oferecendo uma experiência completa de agendamento e acompanhamento de serviços.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nossa missão é simples: garantir que cada pet receba os melhores 
                cuidados possíveis, com a comodidade e segurança que os tutores merecem, 
                aplicando o conhecimento técnico adquirido durante nossa formação acadêmica 
                para criar soluções inovadoras no mercado pet.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Imagem da equipe</span>
            </div>
          </div>
        </section>

        <section className="bg-yellow-500 rounded-lg p-8 mb-16 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">Números que nos Orgulham</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-yellow-100">Profissionais Cadastrados</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2.500+</div>
              <div className="text-yellow-100">Pets Atendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-yellow-100">Cidades Atendidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-yellow-100">Satisfação dos Clientes</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ana Silva</h3>
              <p className="text-yellow-600 font-medium mb-2">CEO & Fundadora</p>
              <p className="text-gray-600 text-sm">
                Veterinária com 10 anos de experiência e apaixonada por inovação.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Carlos Santos</h3>
              <p className="text-yellow-600 font-medium mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Especialista em tecnologia com foco em soluções para o mercado pet.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marina Costa</h3>
              <p className="text-yellow-600 font-medium mb-2">Diretora de Operações</p>
              <p className="text-gray-600 text-sm">
                Responsável por garantir a qualidade dos serviços oferecidos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">contato@petgrooming.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horário de Atendimento</h3>
              <div className="text-gray-600 space-y-2">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-16">
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
