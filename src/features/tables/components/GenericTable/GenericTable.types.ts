import { ColumnDef } from "@tanstack/react-table";

export interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];

  currentPage: number;
  totalPages: number;
  cachedPages: Record<number, T[]>;

  onNext: () => void;
  onPrevious: () => void;
  onPageChange: (pageIndex: number) => void;

  /* OPTIONAL PAGE SIZE FEATURE */

  pageSize?: number;
  onPageSizeChange?: (size: number) => void;

  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
  };
}