import React, { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  useReactTable,
} from '@tanstack/react-table';

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

interface ApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const apiUrl = 'http://localhost:8080/api/employees';

const columns: MyColumn<User>[] = [
  { header: 'ID', accessor: 'id', sortable: true, filterable: true },
  { header: 'Name', accessor: 'firstName', sortable: true, filterable: true },
  { header: 'Surname', accessor: 'lastName', sortable: false, filterable: false },
  { header: 'Email', accessor: 'email', sortable: true, filterable: true },
  { header: 'Age', accessor: 'age', sortable: true, filterable: true },
  { header: 'Status', accessor: 'statusType', sortable: true, filterable: true },
  {
    header: 'Actions',
    accessor: 'actions',
    renderCell: (_, row) => (
      <div className="flex gap-2">
        <button
          onClick={() => alert(`Viewing user: ${row.id}`)}
        >
          View
        </button>
        <button
          onClick={() => alert(`Editing user: ${row.id}`)}
        >
          Edit
        </button>
        <button
          onClick={() => alert(`Deleting user: ${row.id}`)}
        >
          Delete
        </button>
      </div>
    ),
  },
];

const TableExample5: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state compatible with TanStack Table
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Global search (for example: searchParam)
  const [globalSearch, setGlobalSearch] = useState('');

  // Column filters (for simplicity store in a record keyed by accessor)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Derive sortBy and sortOrder from sorting state
  // TanStack Table sorting state e.g. [{id: 'firstName', desc: false}]
  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined;

  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());

  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);

  if (globalSearch) {
    queryParams.append('searchParam', globalSearch);
  }

  // Append filters (Only append filters for filterable columns)
  for (const col of columns) {
    if (col.filterable && typeof col.accessor === 'string') {
      const filterVal = columnFilters[col.accessor];
      if (filterVal) {
        // You can use the accessor name directly as the query param
        // or transform as needed.
        queryParams.append(col.accessor, filterVal);
      }
    }
  }

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}?${queryParams.toString()}`;
      const response = await fetch(url);
      const json: ApiResponse<User> = await response.json();
      setData(json.content);
      setTotalElements(json.totalElements);
      setTotalPages(json.totalPages);
    };
    fetchData();
  }, [page, pageSize, sortBy, sortOrder, globalSearch, columnFilters]);

  // Convert our custom MyColumn definitions to TanStack Table ColumnDef
  const columnHelper = createColumnHelper<User>();

  const tableColumns = useMemo<ColumnDef<User, any>[]>(() => {
    return columns.map((col) => {
      return {
        id: typeof col.accessor === 'string' ? col.accessor : (col.accessor as string),
        header: col.header,
        accessorKey: typeof col.accessor === 'string' ? col.accessor : undefined,
        cell: col.renderCell
          ? ({ getValue, row }) => col.renderCell!(getValue(), row.original)
          : ({ getValue }) => getValue(),
        enableSorting: col.sortable ?? false,
      };
    });
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div>
      {/* Global Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Global search..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      {/* Column filters for filterable columns */}
      <div style={{ marginBottom: '1rem' }}>
        {columns.map((col) => {
          if (col.filterable && typeof col.accessor === 'string') {
            return (
              <div key={col.accessor} style={{ display: 'inline-block', marginRight: '1rem' }}>
                <label>{col.header}: </label>
                <input
                  type="text"
                  value={columnFilters[col.accessor] || ''}
                  onChange={(e) =>
                    setColumnFilters((prev) => ({ ...prev, [col.accessor]: e.target.value }))
                  }
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    style={{ cursor: canSort ? 'pointer' : 'auto' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sortDir === 'asc' && ' 🔼'}
                    {sortDir === 'desc' && ' 🔽'}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={columns.length}>No data found.</td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(0)} disabled={page === 0}>
          {'<<'}
        </button>
        <button onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0}>
          {'<'}
        </button>
        <span>
          Page{' '}
          <strong>
            {page + 1} of {totalPages}
          </strong>{' '}
        </span>
        <button onClick={() => setPage((old) => Math.min(old + 1, totalPages - 1))} disabled={page === totalPages - 1}>
          {'>'}
        </button>
        <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>
          {'>>'}
        </button>

        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        <div>Total elements: {totalElements}</div>
      </div>
    </div>
  );
};

export default TableExample5;
