export interface IService<T> {
  execute(...args: any[]): Promise<T>;
}
