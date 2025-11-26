import { Pastry } from "../../domain/entities/pastry.entity";
import { IUserRepository } from "../../../user/domain/repositories/i-user.repository";
import { IPastryRepository } from "../../domain/repositories/i-pastry.repository";
import { ICategoryRepository } from "../../../category/domain/repositories/i-category.repository";
import { CloudinaryService } from "../../../../shared/infrastructure/storage/cloudinary.service";

export class DeletePastryByIdUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly userRepository: IUserRepository,
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(pastryId: string, userId: string): Promise<Pastry | null> {
        const pastry = await this.pastryRepository.findById(pastryId);

        if (!pastry) {
            return null;
        }

        if (pastry.confectionerId !== userId) {
            throw new Error('Ви не маєте прав на видалення цього десерту');
        }

        const confectionerId = pastry.confectionerId;
        const confectioner = await this.userRepository.findById(confectionerId);

        if (!confectioner) {
            throw new Error('Продавець не знайдений');
        }

        if (!pastry.categoryId) {
            throw new Error('Категорія не знайдена');
        }

        const category = await this.categoryRepository.findById(pastry.categoryId);

        if (!category) {
            throw new Error('Категорія не знайдена');
        }

        if (pastry.images.length > 0) {
            const deletePromises = pastry.images.map(async (image) => {
                const publicId = this.cloudinaryService.getPublicIdFromUrl(image);

                if (publicId) {
                    await this.cloudinaryService.deleteImage(publicId);
                }
            });

            await Promise.all(deletePromises);
        }

        confectioner.removePastryId(pastryId);
        category.removePastryId(pastryId);

        this.pastryRepository.deleteById(pastryId);
        this.userRepository.save(confectioner);
        this.categoryRepository.save(category);

        return pastry;
    }
}