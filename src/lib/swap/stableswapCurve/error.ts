export class NewtonMethodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewtonMethodError';
  }
}
