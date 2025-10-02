import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Key, 
  LogOut, 
  ArrowLeft,
  Settings,
  Shield,
  Trash2
} from "lucide-react";
import { sessionAtom } from "@/lib/atoms/session";
import { EditProfileModal } from "@/components/EditProfileModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { AvatarManager } from "@/components/AvatarManager";
import { deleteAccount } from "@/lib/services/user";
import { toast } from "sonner";
import { useAuthInit } from "@/hooks/use-auth-init";

export function ProfilePage() {
  const user = useAtomValue(sessionAtom);
  const setSession = useSetAtom(sessionAtom);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicializar autenticação
  useAuthInit();

  const handleLogout = () => {
    setSession(null);
    document.cookie = 'token=; Max-Age=0; path=/;';
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setSession(null);
      document.cookie = 'token=; Max-Age=0; path=/;';
      toast.success("Conta excluída com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error);
      toast.error(error.message || "Erro ao excluir conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleProfileUpdated = () => {
    // O sessionAtom já é atualizado automaticamente no modal
    toast.success("Perfil atualizado com sucesso!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar esta página.</p>
          <button
            onClick={() => navigate("/entrar")}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Informações do Usuário */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <AvatarManager size="lg" showEditButton={true} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Membro desde</p>
                  <p className="font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações do Perfil */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações da Conta
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-gray-400 group-hover:text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Editar Perfil</p>
                    <p className="text-sm text-gray-500">Alterar nome e email</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-yellow-500">→</div>
              </button>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400 group-hover:text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Alterar Senha</p>
                    <p className="text-sm text-gray-500">Atualizar sua senha de acesso</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-yellow-500">→</div>
              </button>

              <div className="border-t border-gray-200 my-4"></div>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-red-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">Excluir Conta</p>
                    <p className="text-sm text-gray-500">Remover permanentemente sua conta</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-red-500">→</div>
              </button>
            </div>
          </div>

          {/* Informações de Segurança */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Segurança da Conta</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Suas informações estão protegidas com criptografia de ponta a ponta. 
                  Nunca compartilhe sua senha com terceiros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modais */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleProfileUpdated}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          toast.success("Senha alterada com sucesso!");
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        petName={user.name || 'sua conta'}
        isLoading={isDeleting}
      />
    </div>
  );
}
