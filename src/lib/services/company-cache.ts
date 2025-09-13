import type { Petshop } from '../../types/petshop';

class CompanyCache {
  private cache: Map<string, Petshop> = new Map();

  setCompany(id: string, company: Petshop): void {
    this.cache.set(id, company);
  }

  getCompany(id: string): Petshop | undefined {
    return this.cache.get(id);
  }

  getAllCompanies(): Petshop[] {
    return Array.from(this.cache.values());
  }

  clearCache(): void {
    this.cache.clear();
  }

  hasCompany(id: string): boolean {
    return this.cache.has(id);
  }
}

export const companyCache = new CompanyCache();
