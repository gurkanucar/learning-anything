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
import { useForm } from "react-hook-form";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  statusType: string;
};

type MyColumn<TData> = {
  header: string;
  accessor: keyof TData | string; // allow a string that may not be a key of TData
  sortable?: boolean;
  renderCell?: (value: any, row: TData) => React.ReactNode;
  filterable?: boolean;
};

type DataTableProps<TData> = {
  columns: MyColumn<TData>[];
  pageSizeOptions?: number[];
  apiUrl: string;
};

function DataTable<TData extends { id: number }>({
  columns: myColumns,
  pageSizeOptions = [2, 5, 10, 20],
  apiUrl,
}: DataTableProps<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
        return [{ id, desc: false }];
      }

      if (!existingSort.desc) {
        return [{ id, desc: true }];
      }

      return [];
    });
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const params: any = {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };

    // Sorting
    if (sorting.length > 0) {
      const sort = sorting[0];
      params.sortBy = sort.id;
      params.sortOrder = sort.desc ? "DESC" : "ASC";
    }

    // Column Filters
    columnFilters.forEach((f) => {
      params[f.id] = f.value;
    });

    // Global Filter
    if (globalFilter) {
      params.searchParam = globalFilter;
    }

    try {
      const response = await axios.get(apiUrl, { params });
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
  }, [apiUrl, pagination, sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Ensure each column has a unique id.
  const columnDefs: ColumnDef<TData, any>[] = [
    selectionColumn,
    ...myColumns.map((col, index) =>
      columnHelper.accessor(
        (row) => {
          const accessorKey = typeof col.accessor === "string" ? col.accessor : String(col.accessor);
          return (row as any)[accessorKey];
        },
        {
          id: typeof col.accessor === "string" ? col.accessor : String(col.accessor),
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
            </div>
          ),
          cell: (info) => {
            const row = info.row.original;
            const value = info.getValue();
            return col.renderCell ? col.renderCell(value, row) : value;
          },
        }
      )
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
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
  });

  function handleAction(actionType: string) {
    if (selectedRows.length > 0) {
      alert(`${actionType} action on IDs: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
      fetchData();
    }
  }

  // ----- React Hook Form Integration -----
  const defaultValues: Record<string, string> = { globalSearchTerm: "" };
  myColumns.forEach((col) => {
    if (col.filterable) {
      defaultValues[String(col.accessor)] = "";
    }
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  const onSubmit = (values: Record<string, string>) => {
    const globalValue = values.globalSearchTerm || "";
    setGlobalFilter(globalValue);

    const newColumnFilters: ColumnFiltersState = [];
    myColumns.forEach((col) => {
      if (col.filterable) {
        const val = values[String(col.accessor)];
        if (val && val.trim() !== "") {
          newColumnFilters.push({ id: String(col.accessor), value: val });
        }
      }
    });
    setColumnFilters(newColumnFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchData();
  };

  return (
    <div>
      {/* The Search Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>
            <label style={{ marginRight: "1rem" }}>Global Search:</label>
            <input
              type="text"
              {...register("globalSearchTerm")}
              style={{ padding: "0.5rem", fontSize: "1rem" }}
            />
          </div>

          {/* Column Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {myColumns.map(
              (col) =>
                col.filterable && (
                  <div key={col.accessor.toString()}>
                    <label>{col.header}:</label>
                    <input
                      type="text"
                      {...register(String(col.accessor))}
                      style={{ fontSize: "0.9rem", padding: "0.25rem" }}
                    />
                  </div>
                )
            )}
          </div>

          <div>
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={() => {
                reset();
                setGlobalFilter("");
                setColumnFilters([]);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                fetchData();
              }}
              style={{ marginLeft: "1rem" }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

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
          // row.id is unique as provided by react-table
          <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
            {row.getVisibleCells().map((cell) => {
              // cell.id is unique if each column has a unique id
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

function getSortIcon(id: string, sorting: SortingState) {
  const currentSort = sorting.find((s) => s.id === id);
  if (!currentSort) return null;
  return currentSort.desc ? <ChevronDown /> : <ChevronUp />;
}

export const MyDataTableExample: React.FC = () => {
  const columns: MyColumn<User>[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: true },
    { header: "Name", accessor: "firstName", sortable: true, filterable: true },
    { header: "Surname", accessor: "lastName", sortable: false, filterable: false },
    { header: "Email", accessor: "email", sortable: true, filterable: true },
    { header: "Age", accessor: "age", sortable: true, filterable: true },
    { header: "Status", accessor: "statusType", sortable: true, filterable: true },
    // Use a unique accessor for actions so it does not clash with "id"
    {
      header: "Actions",
      accessor: "actions", 
      renderCell: (_, row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => alert(`Viewing user: ${row.id}`)}>View</button>
          <button onClick={() => alert(`Editing user: ${row.id}`)}>Edit</button>
          <button onClick={() => alert(`Deleting user: ${row.id}`)}>Delete</button>
        </div>
      ),
    },
  ];

  const apiUrl = "http://localhost:8080/api/employees";

  return <DataTable<User> columns={columns} apiUrl={apiUrl} />;
};
