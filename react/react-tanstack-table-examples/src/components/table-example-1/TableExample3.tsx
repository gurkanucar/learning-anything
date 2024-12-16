import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { User } from "@/data";

type TableExample3Props = {
  data: User[];
};

export const TableExample3: React.FC<TableExample3Props> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columnHelper = createColumnHelper<User>();

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

  /** Handles actions (View/Edit/Delete). Shows selected IDs and clears selection afterwards. */
  const handleAction = (actionType: string) => {
    if (selectedRows.length > 0) {
      alert(`${actionType} action on IDs: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
    }
  };

  const columns: ColumnDef<User, any>[] = [
    columnHelper.display({
      id: "select",
      header: () => (
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
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <div
          onClick={() => toggleSort(column.id)}
          style={{ cursor: "pointer" }}
        >
          ID {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => toggleSort(column.id)}
          style={{ cursor: "pointer" }}
        >
          Name {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <div
          onClick={() => toggleSort(column.id)}
          style={{ cursor: "pointer" }}
        >
          Email {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("age", {
      header: ({ column }) => (
        <div
          onClick={() => toggleSort(column.id)}
          style={{ cursor: "pointer" }}
        >
          Age {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <div
          onClick={() => toggleSort(column.id)}
          style={{ cursor: "pointer" }}
        >
          Status {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => alert(`Viewing user: ${row.original.name}`)}>
            <Eye />
          </button>
          <button onClick={() => alert(`Editing user: ${row.original.name}`)}>
            <Edit />
          </button>
          <button onClick={() => alert(`Deleting user: ${row.original.name}`)}>
            <Trash2 />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
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

      <div style={{ marginTop: "1rem" }}>
        <p>{selectedRows.length} row(s) selected</p>
        <button
          onClick={() => handleAction("View")}
          disabled={selectedRows.length === 0}
          style={{ marginRight: "0.5rem" }}
        >
          View
        </button>
        <button
          onClick={() => handleAction("Edit")}
          disabled={selectedRows.length === 0}
          style={{ marginRight: "0.5rem" }}
        >
          Edit
        </button>
        <button
          onClick={() => handleAction("Delete")}
          disabled={selectedRows.length === 0}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
