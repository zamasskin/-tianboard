export interface ConnectionCreateParams {
  provider: string;
  name: string;
  url?: string;
  params?: any;
}

export interface ConnectionApplyParams {
  query: string;
  params?: any;
}
