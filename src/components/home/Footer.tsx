export function Footer() {
  return (
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
          <p>© 2025 PetGrooming. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
