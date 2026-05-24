export default interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}