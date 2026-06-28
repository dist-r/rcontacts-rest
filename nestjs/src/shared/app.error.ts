export class AppError extends Error {

  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}