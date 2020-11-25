export type PaginedResult<T> = {
  Result: T[];
  Count: { count: number }[];
};
