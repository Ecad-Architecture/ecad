type PaginationItem = number | `ellipsis-${number}`;

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Keep the current page and both ends reachable within five numbered buttons.
  const pages =
    currentPage <= 3
      ? [1, 2, 3, totalPages - 1, totalPages]
      : currentPage >= totalPages - 2
        ? [1, 2, totalPages - 2, totalPages - 1, totalPages]
        : [1, currentPage - 1, currentPage, currentPage + 1, totalPages];

  const items: PaginationItem[] = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push(`ellipsis-${page}`);
    }
    items.push(page);
  });

  return items;
}
