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

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

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
  accessor: keyof TData | string;
  sortable?: boolean;
  renderCell?: (value: any, row: TData) => React.ReactNode;
  filterable?: boolean;
};

type FormValues = {
  globalSearchTerm: string;
  [key: string]: string;
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
      if (!existingSort) return [{ id, desc: false }];
      if (!existingSort.desc) return [{ id, desc: true }];
      return [];
    });
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const params: any = {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };

    if (sorting.length > 0) {
      const sort = sorting[0];
      params.sortBy = sort.id;
      params.sortOrder = sort.desc ? "DESC" : "ASC";
    }

    columnFilters.forEach((f) => {
      params[f.id] = f.value;
    });

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
      <Checkbox
        checked={
          table.getRowModel().rows.length > 0 &&
          selectedRows.length === table.getRowModel().rows.length
        }
        onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedRows.includes(row.original.id)}
        onCheckedChange={() => toggleRowSelection(row.original.id)}
      />
    ),
  };

  const columnDefs: ColumnDef<TData, any>[] = [
    selectionColumn,
    ...myColumns.map((col) =>
      columnHelper.accessor(
        (row) => {
          const accessorKey = typeof col.accessor === "string" ? col.accessor : String(col.accessor);
          return (row as any)[accessorKey];
        },
        {
          id: typeof col.accessor === "string" ? col.accessor : String(col.accessor),
          header: ({ column }) => (
            <div className="flex flex-col gap-2">
              <div
                className={`${col.sortable ? "cursor-pointer" : ""} flex items-center gap-2`}
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

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      globalSearchTerm: "",
      ...Object.fromEntries(
        myColumns
          .filter((col) => col.filterable)
          .map((col) => [String(col.accessor), ""])
      ),
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    setGlobalFilter(values.globalSearchTerm || "");
    const newColumnFilters: ColumnFiltersState = [];
    myColumns.forEach((col) => {
      if (col.filterable) {
        const val = values[String(col.accessor)];
        if (val?.trim()) {
          newColumnFilters.push({ id: String(col.accessor), value: val });
        }
      }
    });
    setColumnFilters(newColumnFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchData();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <div className="space-y-2">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="globalSearchTerm">Global Search</Label>
                <Input
                  id="globalSearchTerm"
                  {...register("globalSearchTerm")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myColumns.map(
                (col) =>
                  col.filterable && (
                    <div key={String(col.accessor)}>
                      <Label htmlFor={String(col.accessor)}>{col.header}</Label>
                      <Input
                        id={String(col.accessor)}
                        {...register(String(col.accessor))}
                      />
                    </div>
                  )
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setGlobalFilter("");
                  setColumnFilters([]);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  fetchData();
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </form>

        <div className="mb-4 flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length} row(s) selected
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction("View")}
            disabled={selectedRows.length === 0}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction("Edit")}
            disabled={selectedRows.length === 0}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction("Delete")}
            disabled={selectedRows.length === 0}
          >
            Delete
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                  pageIndex: 0,
                }))
              }
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
            </div>
            <div className="text-sm font-medium">Total: {totalRows}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getSortIcon(id: string, sorting: SortingState) {
  const currentSort = sorting.find((s) => s.id === id);
  if (!currentSort) return null;
  return currentSort.desc ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />;
}

function handleAction(actionType: string) {
  alert(`${actionType} action will be handled here`);
}

export const MyDataTableExample: React.FC = () => {
  const columns: MyColumn<User>[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: true },
    { header: "Name", accessor: "firstName", sortable: true, filterable: true },
    { header: "Surname", accessor: "lastName", sortable: false, filterable: false },
    { header: "Email", accessor: "email", sortable: true, filterable: true },
    { header: "Age", accessor: "age", sortable: true, filterable: true },
    { header: "Status", accessor: "statusType", sortable: true, filterable: true },
    {
      header: "Actions",
      accessor: "actions",
      renderCell: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Viewing user: ${row.id}`)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Editing user: ${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => alert(`Deleting user: ${row.id}`)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const apiUrl = "http://localhost:8080/api/employees";

  return <DataTable<User> columns={columns} apiUrl={apiUrl} />;
};
