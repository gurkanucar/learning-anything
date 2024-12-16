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
import { User } from "../data";
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react"; // Import icons from Lucide

type TableExample1Props = {
  data: User[];
};

export const TableExample1: React.FC<TableExample1Props> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columnHelper = createColumnHelper<User>();

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (isChecked: boolean) => {
    setSelectedRows(isChecked ? data.map((row) => row.id) : []);
  };

  const columns: ColumnDef<User, any>[] = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={selectedRows.length === data.length}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={selectedRows.includes(row.original.id)}
          onChange={() => toggleRowSelection(row.original.id)}
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleSort(column.id)}
        >
          ID
          {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleSort(column.id)}
        >
          Name
          {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleSort(column.id)}
        >
          Email
          {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("age", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleSort(column.id)}
        >
          Age
          {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleSort(column.id)}
        >
          Status
          {getSortIcon(column.id)}
        </div>
      ),
      cell: (info) => (
        <span
          className={`px-2 py-1 text-sm font-medium rounded ${
            info.getValue() === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded"
            onClick={() => alert(`Viewing user: ${row.original.name}`)}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-gray-100 rounded"
            onClick={() => alert(`Editing user: ${row.original.name}`)}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded"
            onClick={() => alert(`Deleting user: ${row.original.name}`)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    }),
  ];

  const toggleSort = (id: string) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (!existing) return [{ id, desc: false }]; // Ascending
      if (!existing.desc) return [{ id, desc: true }]; // Descending
      return []; // Deselect
    });
  };

  const getSortIcon = (id: string) => {
    const sort = sorting.find((s) => s.id === id);
    if (!sort) return null;
    return sort.desc ? (
      <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
    ) : (
      <ChevronUp className="w-4 h-4 ml-1 text-gray-500" />
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
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
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-gray-100 transition duration-150 ${
                selectedRows.includes(row.original.id) ? "bg-blue-50" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          {selectedRows.length} row(s) selected
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => alert("Performing View Action")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={selectedRows.length === 0}
          >
            View
          </button>
          <button
            onClick={() => alert("Performing Edit Action")}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            disabled={selectedRows.length === 0}
          >
            Edit
          </button>
          <button
            onClick={() => alert("Performing Delete Action")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
