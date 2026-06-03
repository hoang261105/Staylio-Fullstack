export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: null;
  errors: ValidationError[];
  timestamp: string;
}