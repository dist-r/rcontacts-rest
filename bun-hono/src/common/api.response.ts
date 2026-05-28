export type ApiResponse<T> = {
  message: string;
  success: boolean;
  data?: T;
};