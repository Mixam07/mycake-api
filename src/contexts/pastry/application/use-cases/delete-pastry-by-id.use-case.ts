import { Pastry } from "../../domain/entities/pastry.entity";
import { IUserRepository } from "../../../user/domain/repositories/i-user.repository";
import { IPastryRepository } from "../../domain/repositories/i-pastry.repository";

export class DeletePastryByIdUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(pastryId: string, userId: string): Promise<Pastry | null> {
        const pastryToDelete = await this.pastryRepository.findById(pastryId);

        if (!pastryToDelete) {
            return null;
        }

        if (pastryToDelete.confectionerId !== userId) {
            throw new Error('Ви не маєте прав на видалення цього десерту');
        }

        const confectionerId = pastryToDelete.confectionerId;
        const confectioner = await this.userRepository.findById(confectionerId);

        if (!confectioner) {
            throw new Error('Продавець не знайдений');
        }

        confectioner.removePastryId(pastryId);

        this.pastryRepository.deleteById(pastryId);
        this.userRepository.save(confectioner);

        return pastryToDelete;
    }
}