import React from "react";
import { Star, TrendingUp, Users, BarChart3 } from "lucide-react";

interface CompanyStatsMockProps {
  companyId: string;
}

export function CompanyStatsMock({ companyId }: CompanyStatsMockProps) {
  // Dados mockados para teste
  const mockStats = {
    companyId,
    averageRating: 4.2,
    totalRatings: 15,
    ratingDistribution: {
      1: 1,
      2: 0,
      3: 2,
      4: 4,
      5: 8
    }
  };

  const renderStars = (rating: number) => {
    const safeRating = rating || 0;
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(safeRating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating: number, total: number) => {
    if (total === 0) return 0;
    return ((rating / total) * 100).toFixed(1);
  };

  const getRatingCount = (rating: number) => {
    return mockStats.ratingDistribution[rating as keyof typeof mockStats.ratingDistribution] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Resumo geral */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Estatísticas da Empresa (Mock)</h3>
          <TrendingUp className="w-6 h-6 text-yellow-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {renderStars(mockStats.averageRating || 0)}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {mockStats.averageRating?.toFixed(1) || '0.0'}
            </div>
            <p className="text-sm text-gray-600">Avaliação média</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {mockStats.totalRatings || 0}
            </div>
            <p className="text-sm text-gray-600">Total de avaliações</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {getRatingCount(5)}
            </div>
            <p className="text-sm text-gray-600">Avaliações 5 estrelas</p>
          </div>
        </div>
      </div>

      {/* Distribuição de avaliações */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição das Avaliações
        </h4>
        
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getRatingCount(rating);
            const percentage = getRatingPercentage(count, mockStats.totalRatings || 0);
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 w-20">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
