export interface User {
  id: string;
  email: string;
  loginId: string;
  role: string;
  password: string;
}

export interface UserResponse {
  email: string;
  loginId: string;
  firstName: string;
  lastName: string;
  role: string;
}
