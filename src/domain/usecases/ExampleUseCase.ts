import { IService } from '../interfaces/IService';

export class ExampleUseCase implements IService<string> {
  async execute(message: string): Promise<string> {
    // Business logic here
    return `Processed: ${message}`;
  }
}
