import { ManageMapsRepo } from '../../domain/interfaces/repositories/ManageMapsRepo';

export class GetMapsInformation {
  constructor(private manageMaps: ManageMapsRepo) {}

  async execute(parent_id: number) {
    return await this.manageMaps.getMapsInformation(parent_id);
  }
}
