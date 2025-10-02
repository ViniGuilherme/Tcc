import type { User } from "@/types/user";

export interface MockUser extends User {
  password: string;
}

export const mockUsers: MockUser[] = [];

export function findMockUser(email: string, password: string): User | null {
  return null;
}

export function findMockUserById(id: string): User | null {
  return null;
}
