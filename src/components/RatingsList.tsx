import React from "react";
import { Star, User, Calendar, ChevronDown } from "lucide-react";
import { useCompanyRatings } from "@/hooks/use-company-ratings";
import { toast } from "sonner";

interface RatingsListProps {
  companyId: string;
  onRatingCreated?: () => void;
}

export function RatingsList({ companyId, onRatingCreated }: RatingsListProps) {
  const { 
    ratings, 
    isLoading, 
    error, 
    total, 
    hasMore, 
    loadMoreRatings, 
    refreshRatings 
  } = useCompanyRatings(companyId, { limit: 10 });

  // Recarregar avaliações quando uma nova for criada
  React.useEffect(() => {
    if (onRatingCreated) {
      refreshRatings();
    }
  }, [onRatingCreated, refreshRatings]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Carregando avaliações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Erro ao carregar avaliações</p>
        <button
          onClick={refreshRatings}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo das avaliações */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {getAverageRating()}
                </span>
                <div>
                  {renderStars(Math.round(parseFloat(getAverageRating())))}
                  <p className="text-sm text-gray-600">
                    {total} avaliação{total !== 1 ? 'ões' : ''}
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Lista de avaliações */}
      {ratings.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma avaliação ainda
          </h3>
          <p className="text-gray-600">
            Seja o primeiro a avaliar esta empresa!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Usuário</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(rating.rating)}
                      <span className="text-sm text-gray-500">
                        {rating.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                {rating.createdAt && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(rating.createdAt)}
                  </div>
                )}
              </div>
              
              {rating.comment && (
                <p className="text-gray-700 mt-2 leading-relaxed">
                  {rating.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botão Carregar Mais */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMoreRatings}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Carregando...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Carregar mais avaliações
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
