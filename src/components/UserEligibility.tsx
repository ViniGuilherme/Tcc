import React from "react";
import { CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import { useUserEligibility } from "@/hooks/use-company-stats";

interface UserEligibilityProps {
  companyId: string;
  onEligibilityChange?: (canRate: boolean) => void;
}

export function UserEligibility({ companyId, onEligibilityChange }: UserEligibilityProps) {
  const { eligibility, isLoading, error, refreshEligibility } = useUserEligibility(companyId);

  React.useEffect(() => {
    if (eligibility && onEligibilityChange) {
      onEligibilityChange(eligibility.canRate);
    }
  }, [eligibility, onEligibilityChange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-gray-600">Verificando elegibilidade...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">Erro ao verificar elegibilidade</span>
        </div>
        <button
          onClick={refreshEligibility}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!eligibility) {
    return null;
  }

  if (eligibility.canRate) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700">Você pode avaliar esta empresa</span>
        </div>
        <Star className="w-5 h-5 text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-yellow-500" />
        <div className="flex flex-col">
          <span className="text-sm text-yellow-700">
            {eligibility.reason || "Você não pode avaliar esta empresa"}
          </span>
          {eligibility.existingRating && (
            <span className="text-xs text-yellow-600 mt-1">
              Você já avaliou esta empresa anteriormente
            </span>
          )}
        </div>
      </div>
      <XCircle className="w-5 h-5 text-yellow-500" />
    </div>
  );
}
