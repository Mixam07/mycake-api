import { Pastry } from "../entities/pastry.entity";

export interface PaginatedPastries {
    pastries: Pastry[];
    total: number;
}

export interface IPastryRepository {
    save(pastry: Pastry): Promise<void>;
    find(page?: number, limit?: number): Promise<PaginatedPastries>;
    findById(id: string): Promise<Pastry | null>;
    deleteById(patryId: string): Promise<Pastry | null>;
}