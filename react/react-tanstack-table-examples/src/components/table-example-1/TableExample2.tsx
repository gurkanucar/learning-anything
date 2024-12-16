import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import {
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { User } from "@/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableExample2Props {
  data: User[];
}

export const TableExample2: React.FC<TableExample2Props> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: "view" | "edit" | "delete" | null;
  }>({ isOpen: false, type: null });

  const columnHelper = createColumnHelper<User>();

  const handleAction = (type: "view" | "edit" | "delete") => {
    setActionDialog({ isOpen: true, type });
  };

  const handleActionConfirm = () => {
    const actionType = actionDialog.type;
    const selectedIds = selectedRows.join(", ");
    alert(`Performing ${actionType} action on IDs: ${selectedIds}`);
    setSelectedRows([]); // Clear selection after action
    setActionDialog({ isOpen: false, type: null });
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (isChecked: boolean) => {
    setSelectedRows(isChecked ? data.map((row) => row.id) : []);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      pending: "bg-yellow-500",
    };
    return colors[status.toLowerCase()] || "bg-gray-500";
  };

  const getActionTitle = (type: "view" | "edit" | "delete" | null) => {
    if (!type) return "Confirm Action";
    return `Confirm ${type.charAt(0).toUpperCase()}${type.slice(1)} Action`;
  };

  const columns: ColumnDef<User, any>[] = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 focus:ring-blue-500"
          checked={selectedRows.length === data.length}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 focus:ring-blue-500"
          checked={selectedRows.includes(row.original.id)}
          onChange={() => toggleRowSelection(row.original.id)}
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => toggleSort(column.id)}
        >
          <span>ID</span>
          {getSortIcon(column.id)}
        </button>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => toggleSort(column.id)}
        >
          <span>Name</span>
          {getSortIcon(column.id)}
        </button>
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => toggleSort(column.id)}
        >
          <span>Email</span>
          {getSortIcon(column.id)}
        </button>
      ),
    }),
    columnHelper.accessor("age", {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => toggleSort(column.id)}
        >
          <span>Age</span>
          {getSortIcon(column.id)}
        </button>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1"
          onClick={() => toggleSort(column.id)}
        >
          <span>Status</span>
          {getSortIcon(column.id)}
        </button>
      ),
      cell: (info) => (
        <Badge className={getStatusBadgeColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              alert(
                `Viewing user: ${row.original.name} (ID: ${row.original.id})`
              )
            }
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              alert(
                `Editing user: ${row.original.name} (ID: ${row.original.id})`
              )
            }
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              alert(
                `Deleting user: ${row.original.name} (ID: ${row.original.id})`
              )
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const toggleSort = (id: string) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (!existing) return [{ id, desc: false }];
      if (!existing.desc) return [{ id, desc: true }];
      return [];
    });
  };

  const getSortIcon = (id: string) => {
    const sort = sorting.find((s) => s.id === id);
    if (!sort) return null;
    return sort.desc ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronUp className="h-4 w-4" />
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{pagination.pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedRows.length} row(s) selected
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handleAction("view")}
            disabled={selectedRows.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("edit")}
            disabled={selectedRows.length === 0}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("delete")}
            disabled={selectedRows.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog
        open={actionDialog.isOpen}
        onOpenChange={(isOpen) =>
          setActionDialog({ isOpen, type: actionDialog.type })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {getActionTitle(actionDialog.type)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionDialog.type} the following IDs:{" "}
              {selectedRows.join(", ")}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setActionDialog({ isOpen: false, type: null })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleActionConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TableExample2;
