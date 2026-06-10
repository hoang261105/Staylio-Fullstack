import type { HotelBranchResponse } from "../../../../common/interfaces/response/HotelBranchResponse";
import BranchCard from "./BranchCard";
import { useTranslation } from "react-i18next";

interface BranchListProps {
  branches: HotelBranchResponse[];
  isLoading: boolean;
}

export default function BranchList({ branches, isLoading }: BranchListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-[360px]">
            <div className="h-48 sm:h-56 bg-muted"></div>
            <div className="p-5 flex flex-col grow gap-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="mt-auto pt-4 flex justify-between border-t border-border">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-muted rounded-2xl border border-dashed border-border">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">{t('locationBranches.noHotelsFound')}</h3>
        <p className="text-muted-foreground max-w-sm">{t('locationBranches.noHotelsFoundDesc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
