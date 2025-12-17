import { IMetadata } from "./metadata";

export interface IResponse<T> {
  results?: number;
  metadata?: IMetadata;
  data: T[];
}
