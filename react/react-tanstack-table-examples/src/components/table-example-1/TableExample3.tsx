import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: string;
};

/** Type for each column configuration */
type MyColumn<TData> = {
  header: string;
  accessor: keyof TData;
  sortable?: boolean;
  renderCell?: (value: any, row: TData) => React.ReactNode;
  filterable?: boolean;
};

/** DataTableProps:
 * data is fetched externally, but here we will simulate that we pass data
 * after fetching from server
 */
type DataTableProps<TData> = {
  columns: MyColumn<TData>[];
  pageSizeOptions?: number[];
  apiUrl: string; // URL to fetch data from
};

function DataTable<TData extends { id: number }>(props: DataTableProps<TData>) {
  const {
    columns: myColumns,
    pageSizeOptions = [2, 5, 10, 20],
    apiUrl,
  } = props;

  // States for server-side control
  const [data, setData] = useState<TData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Helper for building column definitions
  const columnHelper = createColumnHelper<TData>();

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSelectAll = (isChecked: boolean) => {
    const allIds = table.getRowModel().rows.map((r) => r.original.id);
    setSelectedRows(isChecked ? allIds : []);
  };

  function toggleSort(id: string) {
    setSorting((prevSorting) => {
      const existingSort = prevSorting.find((s) => s.id === id);

      if (!existingSort) {
        // No sorting: add ascending sort
        return [{ id, desc: false }];
      }

      if (!existingSort.desc) {
        // Ascending: change to descending
        return [{ id, desc: true }];
      }

      // Descending: remove sort
      return [];
    });
  }

  /** Fetch data from API whenever state changes */
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Prepare query params
    const params: any = {
      page: pagination.pageIndex, // assuming API is 0-based or 1-based, adjust as needed
      pageSize: pagination.pageSize,
    };

    // Sorting
    if (sorting.length > 0) {
      const sort = sorting[0];
      params.sortBy = sort.id;
      params.sortOrder = sort.desc ? "DESC" : "ASC";
    }

    // Filters
    columnFilters.forEach((f) => {
      params[`${f.id}`] = f.value;
    });

    try {
      const response = await axios.get(apiUrl, { params });
      // Assume the response structure: { content: TData[], totalElements: number }
      const { content, totalElements } = response.data;
      setData(content);
      setTotalRows(totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, pagination, sorting, columnFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Column for selection (checkbox)
  const selectionColumn: ColumnDef<TData, unknown> = {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={
          table.getRowModel().rows.length > 0 &&
          selectedRows.length === table.getRowModel().rows.length
        }
        onChange={(e) => toggleSelectAll(e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedRows.includes(row.original.id)}
        onChange={() => toggleRowSelection(row.original.id)}
      />
    ),
  };

  const columnDefs: ColumnDef<TData, any>[] = [
    selectionColumn,
    ...myColumns.map((col) =>
      columnHelper.accessor((row) => row[col.accessor], {
        id: String(col.accessor),
        header: ({ column }) => (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              style={{ cursor: col.sortable ? "pointer" : "default" }}
              onClick={() => col.sortable && toggleSort(column.id)}
            >
              {col.header} {col.sortable && getSortIcon(column.id, sorting)}
            </div>
            {col.filterable && (
              <input
                type="text"
                placeholder={`Search ${col.header}`}
                value={
                  (columnFilters.find((f) => f.id === column.id)
                    ?.value as string) || ""
                }
                onChange={(e) =>
                  setColumnFilters((old) => {
                    const value = e.target.value;
                    // Update or add the filter
                    const existingFilter = old.find((f) => f.id === column.id);
                    if (existingFilter) {
                      return old.map((f) =>
                        f.id === column.id ? { ...f, value } : f
                      );
                    } else {
                      return [...old, { id: column.id, value }];
                    }
                  })
                }
                style={{ fontSize: "0.9rem", padding: "0.25rem" }}
              />
            )}
          </div>
        ),
        cell: (info) => {
          const row = info.row.original;
          const value = info.getValue();
          return col.renderCell ? col.renderCell(value, row) : value;
        },
      })
    ),
  ];

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: { sorting, pagination, columnFilters },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // We handle data fetching manually
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
  });

  function handleAction(actionType: string) {
    if (selectedRows.length > 0) {
      alert(`${actionType} action on IDs: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
      // After action, refetch data
      fetchData();
    }
  }

  return (
    <div>
      <DataTableHeader selectedRows={selectedRows} onAction={handleAction} />
      {isLoading && <div>Loading...</div>}
      <DataTableBody table={table} />
      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        setPagination={setPagination}
        totalRows={totalRows}
      />
    </div>
  );
}

/** Header component (for actions, selected info, etc.) */
type DataTableHeaderProps = {
  selectedRows: number[];
  onAction: (action: string) => void;
};
function DataTableHeader({ selectedRows, onAction }: DataTableHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <p>{selectedRows.length} row(s) selected</p>
      <button
        onClick={() => onAction("View")}
        disabled={selectedRows.length === 0}
      >
        View
      </button>
      <button
        onClick={() => onAction("Edit")}
        disabled={selectedRows.length === 0}
      >
        Edit
      </button>
      <button
        onClick={() => onAction("Delete")}
        disabled={selectedRows.length === 0}
      >
        Delete
      </button>
    </div>
  );
}

/** Body component renders the table headers and rows */
function DataTableBody<TData extends { id: number }>({
  table,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
}) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id} style={{ padding: "0.5rem" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Pagination component for handling pagination controls */
type DataTablePaginationProps = {
  table: ReturnType<typeof useReactTable<any>>;
  pageSizeOptions: number[];
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  totalRows: number;
};
function DataTablePagination({
  table,
  pageSizeOptions,
  setPagination,
  totalRows,
}: DataTablePaginationProps) {
  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <span>Rows per page:</span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) =>
          setPagination((prev) => ({
            ...prev,
            pageSize: Number(e.target.value),
            pageIndex: 0,
          }))
        }
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </button>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </button>

      <span>
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
        {table.getPageCount()}
      </span>

      <span>Total: {totalRows}</span>
    </div>
  );
}

/** Returns the appropriate sort icon for a column */
function getSortIcon(id: string, sorting: SortingState) {
  const currentSort = sorting.find((s) => s.id === id);
  if (!currentSort) return null;
  return currentSort.desc ? <ChevronDown /> : <ChevronUp />;
}

/** Example usage */
export const MyDataTableExample: React.FC = () => {
  const columns: MyColumn<User>[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: true },
    { header: "Name", accessor: "firstName", sortable: true, filterable: true },
    { header: "Email", accessor: "email", sortable: true, filterable: true },
    { header: "Age", accessor: "age", sortable: true, filterable: true },
    { header: "Status", accessor: "status", sortable: true, filterable: true },
    {
      header: "Actions",
      accessor: "id",
      renderCell: (_, row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => alert(`Viewing user: ${row.id}`)}>View</button>
          <button onClick={() => alert(`Editing user: ${row.id}`)}>Edit</button>
          <button onClick={() => alert(`Deleting user: ${row.id}`)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Replace with your actual API endpoint
  const apiUrl = "http://localhost:8080/api/employees";

  return <DataTable<User> columns={columns} apiUrl={apiUrl} />;
};
