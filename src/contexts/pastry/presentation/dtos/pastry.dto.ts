import { Pastry } from "../../domain/entities/pastry.entity";

export interface CreatePastryDto {
    categoryId: string;
    status: string;
    name: string;
    price: number;
    description: string;
    tags: string[];
    weight: number;
    fillings: string[];
    additionalServices: string[];
    minWeight: number;
    maxWeight: number;
}

export interface UpdatePastryDto {
    categoryId: string;
    status: string;
    name: string;
    price: number;
    description: string;
    tags: string[];
    weight: number;
    fillings: string[];
    additionalServices: string[];
    minWeight: number;
    maxWeight: number;
}

export class PastryResponseDto {
    static fromEntity(pastry: Pastry) {
        return {
            id: pastry.id,
            category: pastry.categoryName, 
            status: pastry.status,
            images: pastry.images,
            name: pastry.name,
            price: pastry.price,
            description: pastry.description,
            tags: pastry.tags,
            weight: pastry.weight,
            fillings: pastry.fillings,
            additionalServices: pastry.additionalServices,
            minWeight: pastry.minWeight,
            maxWeight: pastry.maxWeight,
            confectionerId: pastry.confectionerId,
            createdAt: pastry.createdAt,
            updatedAt: pastry.updatedAt,
        };
    }

    static fromEntities(users: Pastry[]) {
        return users.map(user => PastryResponseDto.fromEntity(user));
    }
}