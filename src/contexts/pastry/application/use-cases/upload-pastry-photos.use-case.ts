import { CloudinaryService } from '../../../../shared/infrastructure/storage/cloudinary.service';
import { Pastry } from '../../domain/entities/pastry.entity';
import { IPastryRepository } from '../../domain/repositories/i-pastry.repository';

export class UploadPastryPhotosUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async execute(pastryId: string, filesBuffers: Buffer[]): Promise<Pastry | null> {
        const pastry = await this.pastryRepository.findById(pastryId);

        if (!pastry) {
            return null;
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

        const uploadPromises = filesBuffers.map(buffer => 
            this.cloudinaryService.uploadImage(buffer, 'pastries')
        );

        const newImageUrls = await Promise.all(uploadPromises);

        pastry.addImages(newImageUrls);

        await this.pastryRepository.save(pastry);

        return pastry;
    }
}