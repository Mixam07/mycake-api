import { IPastryRepository } from "../../../pastry/domain/repositories/i-pastry.repository";
import { IUserRepository } from "../../../user/domain/repositories/i-user.repository";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/repositories/i-category.repository";

export class DeleteCategoryByIdUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository,
        private readonly pastryRepository: IPastryRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(categoryId: string): Promise<Category | null> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            return null;
        }

        for (let pastryId of category.pastries) {
            const pastry = await this.pastryRepository.findById(pastryId);

            if (!pastry) {
                throw new Error('Десерт не знайдено');
            }

            const seller = await this.userRepository.findById(pastry.sellerId);

            if (!seller) {
                throw new Error('Користувача не знайдено');
            }

            seller.removePastryId(pastry.id);

            Promise.all([
                this.pastryRepository.deleteById(pastry.id),
                this.userRepository.save(seller)
            ])
        }

        await this.categoryRepository.deleteById(categoryId)

        return category;
    }
}