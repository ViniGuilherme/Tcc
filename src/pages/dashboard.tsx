import { useState, useEffect } from "react";
import { Bell, ChevronDown, Plus, Edit, Trash2, Heart } from "lucide-react";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms/session";
import { AddPetModal } from "../components/AddPetModal";
import { EditPetModal } from "../components/EditPetModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { AvatarManager } from "../components/AvatarManager";
import { getUserAnimals, deleteAnimal, type Animal } from "@/lib/services/animals";
import { toast } from "sonner";

export function Dashboard() {
  const user = useAtomValue(sessionAtom);
  const [pets, setPets] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      
      if (user?.id) {
        const response = await getUserAnimals({ page: 1, limit: 50 });
        setPets(response.data);
      } else {
        setPets([]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar pets:', error);
      toast.error(error.message || 'Erro ao carregar pets. Tente novamente.');
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPet = (pet: Animal) => {
    setSelectedPet(pet);
    setIsEditModalOpen(true);
  };

  const handleDeletePet = (pet: Animal) => {
    setSelectedPet(pet);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPet?.id) return;

    setIsDeleting(true);
    try {
      await deleteAnimal(selectedPet.id);
      setPets(pets.filter(pet => pet.id !== selectedPet.id));
      toast.success("Pet excluído com sucesso!");
      setIsDeleteModalOpen(false);
      setSelectedPet(null);
    } catch (error: any) {
      console.error('Erro ao excluir pet:', error);
      toast.error(error.message || "Erro ao excluir pet. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedPet(null);
  };

  const handleAddPet = () => {
    setIsModalOpen(true);
  };

  const handlePetCreated = () => {
    loadPets();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-yellow-500 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              PetGrooming
            </div>

            <nav className="hidden md:flex space-x-8">
              <button className="hover:text-yellow-200 transition-colors">
                Meus Agendamentos
              </button>
              <button className="text-white font-semibold border-b-2 border-white">
                Meus Pets
              </button>
              <button className="hover:text-yellow-200 transition-colors">
                Buscar Serviços
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer hover:text-yellow-200" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-yellow-600 px-2 py-1 rounded transition-colors">
                <AvatarManager size="sm" showEditButton={false} />
                <span>Olá, {user?.name || 'Usuário'}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Pets</h1>
          <button 
            onClick={handleAddPet}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Pet
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Pets Cadastrados</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Carregando pets...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {pet.image ? (
                        <img 
                          src={pet.image} 
                          alt={pet.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${pet.image ? 'hidden' : ''}`}>
                        <span className="text-2xl font-bold text-gray-400">
                          {pet.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-gray-600">{pet.breed}</p>
                      <p className="text-gray-500 text-sm">{pet.age}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-4">
                    <button 
                      onClick={() => handleEditPet(pet)}
                      className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeletePet(pet)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pets.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pet cadastrado</h3>
              <p className="text-gray-600 mb-6">Adicione seu primeiro pet para começar a usar nossos serviços.</p>
              <button 
                onClick={handleAddPet}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Adicionar Pet
              </button>
            </div>
          )}
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
                <li><a href="#" className="hover:text-white transition-colors">Buscar Serviços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Para Empresas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cadastre seu negócio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login Parceiro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vantagens</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span className="text-white text-sm font-bold">IG</span>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-white text-sm font-bold">FB</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 PetGrooming. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePetCreated}
      />

      <EditPetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPet(null);
        }}
        onSuccess={handlePetCreated}
        pet={selectedPet}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        petName={selectedPet?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
