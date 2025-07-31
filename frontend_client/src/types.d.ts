export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface Operation {
  id: number;
  name: string;
  product_id: number;
  step_number: number;
  mct_time: number;
}
