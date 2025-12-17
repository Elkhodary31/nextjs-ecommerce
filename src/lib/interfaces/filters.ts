export interface IProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  brands?: string[];
}
