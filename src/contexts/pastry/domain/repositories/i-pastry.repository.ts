import { Pastry } from "../entities/pastry.entity";

export interface PaginatedPastries {
    pastries: Pastry[];
    total: number;
}

export interface IPastryRepository {
    save(pastry: Pastry): Promise<void>;
    find(page?: number, limit?: number): Promise<PaginatedPastries>;
    findById(id: string): Promise<Pastry | null>;
    findBySellerId(sellerId: string): Promise<Pastry[]>;
    findByCategoryId(categoryId: string): Promise<Pastry[]>;
    deleteById(patryId: string): Promise<Pastry | null>;
}