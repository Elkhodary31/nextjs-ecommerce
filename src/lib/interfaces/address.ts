export interface IAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface IAddressResponse {
  status: string;
  message?: string;
  data: IAddress | IAddress[];
  results?: number;
}

export interface IAddressRequest {
  name: string;
  details: string;
  phone: string;
  city: string;
}
