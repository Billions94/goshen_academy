export function paginationMapper<T>({
  page,
  limit,
  results,
  pageCount,
}: {
  page: number;
  limit: number;
  results: T[];
  pageCount: number;
}) {
  return {
    page,
    limit,
    results,
    pageCount,
  };
}
