import { ExampleUseCase } from '../../domain/usecases/ExampleUseCase';

export class ExampleService {
  private useCase: ExampleUseCase;

  constructor() {
    this.useCase = new ExampleUseCase();
  }

  async processMessage(message: string): Promise<string> {
    return await this.useCase.execute(message);
  }
}
