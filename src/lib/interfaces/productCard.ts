import { IProduct } from "./product";

export interface IproductCardProps {
  product: IProduct;
  isWished?: boolean;
  onToggleWish?: (id: string) => void;
  showRemove?: boolean;
  onRemove?: (id: string) => void;
}
