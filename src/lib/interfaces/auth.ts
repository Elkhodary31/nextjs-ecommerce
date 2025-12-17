export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}
export interface IRegisterResponse {
  message: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
