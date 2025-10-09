import { useState, useRef } from "react";
import { Camera, Upload, X, User } from "lucide-react";
import { uploadAvatar, deleteAvatar } from "@/lib/services/user";
import { useAtomValue, useSetAtom } from "jotai";
import { sessionAtom } from "@/lib/atoms/session";
import { toast } from "sonner";

interface AvatarManagerProps {
  size?: "sm" | "md" | "lg";
  showEditButton?: boolean;
  className?: string;
}

export function AvatarManager({ 
  size = "md", 
  showEditButton = true, 
  className = "" 
}: AvatarManagerProps) {
  const user = useAtomValue(sessionAtom);
  const setSession = useSetAtom(sessionAtom);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAvatar(file);
      
      // Atualizar a sessão com o novo avatar
      if (user) {
        setSession({
          ...user,
          avatar: response.avatarUrl
        });
      }
      
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error(error.message || 'Erro ao fazer upload do avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;

    setIsDeleting(true);
    try {
      await deleteAvatar();
      
      // Atualizar a sessão removendo o avatar
      if (user) {
        setSession({
          ...user,
          avatar: undefined
        });
      }
      
      toast.success('Avatar removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      toast.error(error.message || 'Erro ao remover avatar. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Avatar */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative group`}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Se a imagem falhar ao carregar, mostrar inicial
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback para inicial ou quando não há avatar */}
        <div className={`w-full h-full flex items-center justify-center ${user?.avatar ? 'hidden' : ''}`}>
          <span className={`font-bold text-gray-400 ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'}`}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>

        {/* Overlay de loading */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Botão de editar */}
        {showEditButton && !isUploading && !isDeleting && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
            <button
              onClick={handleEditClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
            >
              <Camera className={`${iconSizes[size]} text-gray-600`} />
            </button>
          </div>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Botões de ação (quando há avatar) */}
      {user?.avatar && showEditButton && (
        <div className="absolute -bottom-1 -right-1 flex gap-1">
          <button
            onClick={handleEditClick}
            disabled={isUploading || isDeleting}
            className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Alterar avatar"
          >
            <Upload className="w-3 h-3" />
          </button>
          <button
            onClick={handleDeleteAvatar}
            disabled={isUploading || isDeleting}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remover avatar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
