import { useState, useEffect } from "react";
import { X, Star, Send } from "lucide-react";
import { createRating, type CreateRatingData } from "@/lib/services/ratings";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms/session";
import { toast } from "sonner";
import { UserEligibility } from "./UserEligibility";

interface CreateRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: string;
  companyName: string;
}

export function CreateRatingModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  companyId, 
  companyName 
}: CreateRatingModalProps) {
  const user = useAtomValue(sessionAtom);
  const [formData, setFormData] = useState<CreateRatingData>({
    companyId,
    rating: 0,
    comment: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredStar, setHoveredStar] = useState(0);
  const [canRate, setCanRate] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ""}));
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({...prev, rating}));
    if (errors.rating) {
      setErrors(prev => ({...prev, rating: ""}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = "Avaliação é obrigatória";
    }

    if (formData.comment && formData.comment.length > 500) {
      newErrors.comment = "Comentário deve ter no máximo 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Você precisa estar logado para avaliar");
      return;
    }

    if (!canRate) {
      toast.error("Você não pode avaliar esta empresa");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await createRating(formData);
      toast.success('Avaliação criada com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar avaliação:', error);
      toast.error(error.message || 'Erro ao criar avaliação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      companyId,
      rating: 0,
      comment: ""
    });
    setErrors({});
    setHoveredStar(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Avaliar Empresa</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {companyName}
            </h3>
            <p className="text-gray-600 text-sm">
              Como foi sua experiência com esta empresa?
            </p>
          </div>

          <UserEligibility 
            companyId={companyId} 
            onEligibilityChange={setCanRate}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Avaliação *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            <p className="text-gray-500 text-xs mt-1">
              {formData.rating === 0 
                ? "Selecione uma avaliação" 
                : formData.rating === 1 
                ? "Péssimo" 
                : formData.rating === 2 
                ? "Ruim" 
                : formData.rating === 3 
                ? "Regular" 
                : formData.rating === 4 
                ? "Bom" 
                : "Excelente"
              }
            </p>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comentário (Opcional)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Conte-nos mais sobre sua experiência..."
            />
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
            <p className="text-gray-500 text-xs mt-1">
              {formData.comment.length}/500 caracteres
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || formData.rating === 0 || !canRate}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Avaliação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
