import { useState } from "react";
import { useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms/session";
import { User, LogOut, ChevronDown } from "lucide-react";
import { AvatarManager } from "./AvatarManager";

interface HeaderProps {
  showSearch?: boolean;
}

export function Header({ showSearch = false }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAtomValue(sessionAtom);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // Limpar sessão e recarregar página
    document.cookie = 'token=; Max-Age=0; path=/;';
    window.location.reload();
  };


  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <button
        onClick={() => navigate('/')}
        className="text-yellow-500 font-bold text-xl"
      >
        PetGrooming
      </button>      
      <nav className="flex gap-6 text-sm text-gray-800 font-medium">
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
        {user ? (
          // Usuário logado
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-600 transition-colors"
            >
              <AvatarManager size="sm" showEditButton={false} />
              <span>{user.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/perfil');
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          // Usuário não logado
          <>
            <button 
              onClick={() => navigate('/entrar')}
              className="text-gray-700 font-medium hover:text-gray-600 cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/cadastrar')}
              className="bg-yellow-500 text-white font-bold px-4 py-1 rounded-full hover:bg-yellow-600 cursor-pointer"
            >
              Cadastre-se
            </button>
          </>
        )}
      </div>
    </header>
  );
}
