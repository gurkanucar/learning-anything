import React, { useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { User } from "@/data"; // Your data type

/** Type for each column configuration passed to DataTable */
type MyColumn<TData> = {
  header: string;
  accessor: keyof TData;
  sortable?: boolean;
  renderCell?: (value: any, row: TData) => React.ReactNode;
};

/** DataTableProps:
 *  - data: Your array of items
 *  - columns: Array of MyColumn objects
 *  - selectable?: Whether rows should be selectable (default: true)
 *  - initialPageSize?: starting page size
 *  - pageSizeOptions?: which page size options are available
 */
type DataTableProps<TData> = {
  data: TData[];
  columns: MyColumn<TData>[];
  selectable?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

/** Main reusable DataTable component */
function DataTable<TData extends { id: number }>(props: DataTableProps<TData>) {
  const {
    data,
    columns: myColumns,
    selectable = true,
    initialPageSize = 5,
    pageSizeOptions = [5, 10, 20],
  } = props;

  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Helper for building column definitions
  const columnHelper = createColumnHelper<TData>();

  // Convert MyColumn<TData> to ColumnDef
  const columns: ColumnDef<TData, any>[] = [
    // If selectable, add the select checkbox column
    ...(selectable
      ? [
          columnHelper.display({
            id: "select",
            header: ({ table }) => (
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
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
          }),
        ]
      : []),
    // Render other columns from myColumns
    ...myColumns.map((col) =>
      columnHelper.accessor((row) => row[col.accessor], {
        id: String(col.accessor),
        header: ({ column }) => (
          <div
            style={{ cursor: col.sortable ? "pointer" : "default" }}
            onClick={() => col.sortable && toggleSort(column.id)}
          >
            {col.header} {col.sortable && getSortIcon(column.id)}
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

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(data.length / pagination.pageSize),
    manualPagination: false,
  });

  /** Toggles a single row's selection state */
  const toggleRowSelection = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  /** Selects or deselects all rows */
  const toggleSelectAll = (isChecked: boolean) => {
    setSelectedRows(isChecked ? data.map((row) => row.id) : []);
  };

  /** Cycles through sorting states: none -> ascending -> descending -> none */
  const toggleSort = (id: string) => {
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
  };

  /** Returns the appropriate sort icon for a column */
  const getSortIcon = (id: string) => {
    const currentSort = sorting.find((s) => s.id === id);
    if (!currentSort) return null;
    return currentSort.desc ? <ChevronDown /> : <ChevronUp />;
  };

  return (
    <div>
      <DataTableHeader
        selectedRows={selectedRows}
        onAction={(action) => handleAction(action)}
      />
      <DataTableBody table={table} />
      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        setPagination={setPagination}
      />
    </div>
  );

  /** Handles actions (View/Edit/Delete). Shows selected IDs and clears selection afterwards. */
  function handleAction(actionType: string) {
    if (selectedRows.length > 0) {
      alert(`${actionType} action on IDs: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
    }
  }
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
function DataTableBody<TData>({
  table,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
}) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
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
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ padding: "0.5rem" }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
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
};
function DataTablePagination({
  table,
  pageSizeOptions,
  setPagination,
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
    </div>
  );
}

/** Example Usage with User data */
type TableExample3Props = {
  data: User[];
};

export const TableExample3: React.FC<TableExample3Props> = ({ data }) => {
  const columns: MyColumn<User>[] = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Age", accessor: "age", sortable: true },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      renderCell: (_, row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div>{row.status === "Active" ? "+" : "-"}</div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      renderCell: (_, row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => alert(`Viewing user: ${row.name}`)}>
            View
          </button>
          <button onClick={() => alert(`Editing user: ${row.name}`)}>
            Edit
          </button>
          <button onClick={() => alert(`Deleting user: ${row.name}`)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={data} columns={columns} />;
};
