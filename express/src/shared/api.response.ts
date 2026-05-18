export default interface ApiResponse<T> {
  message: string;
  data: T;
}