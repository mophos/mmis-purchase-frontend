export interface IProductOrderItem {
  product_id?: any;
  generic_id?: any;
  product_name?: any;
  generic_name?: any;
  fullname?: any;
}
export interface IProductOrderItems extends IProductOrderItem {
  cost?: number;
  qty?: any;
  total_small_qty?: number;
  total_cost?: number;
  is_giveaway?: any;
  unit_generic_id?: any;
  small_qty?: number;
  contract_id?: any;
  contract_no?: any;
}