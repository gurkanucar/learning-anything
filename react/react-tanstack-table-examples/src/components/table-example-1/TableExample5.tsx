import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
import { debounce } from 'lodash';
import { Search, X } from 'lucide-react';

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
        <button onClick={() => alert(`Viewing user: ${row.id}`)}>View</button>
        <button onClick={() => alert(`Editing user: ${row.id}`)}>Edit</button>
        <button onClick={() => alert(`Deleting user: ${row.id}`)}>Delete</button>
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

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // Actual global search state (used for fetching data)
  const [globalSearch, setGlobalSearch] = useState('');

  // Local input state for global search (immediately reflects user input)
  const [localGlobalSearch, setLocalGlobalSearch] = useState('');

  // Actual column filters state (used for fetching data)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Local input states for column filters
  const [localColumnFilters, setLocalColumnFilters] = useState<Record<string, string>>({});

  // Current open filter menu column ID
  const [filterMenuOpen, setFilterMenuOpen] = useState<string | null>(null);

  // Ref for the currently open filter menu
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuOpen &&
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMenuOpen]);

  // Derive sortBy and sortOrder from sorting state
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

  // Append filters
  for (const col of columns) {
    if (col.filterable && typeof col.accessor === 'string') {
      const filterVal = columnFilters[col.accessor];
      if (filterVal) {
        queryParams.append(col.accessor, filterVal);
      }
    }
  }

  // Fetch data
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

  // Debounce application of global search to actual state
  const applyGlobalSearch = useCallback(
    debounce((val: string) => {
      setGlobalSearch(val);
    }, 300),
    []
  );

  useEffect(() => {
    applyGlobalSearch(localGlobalSearch);
  }, [localGlobalSearch, applyGlobalSearch]);

  // Debounce application of column filters to actual state
  const applyColumnFilters = useCallback(
    debounce((filters: Record<string, string>) => {
      setColumnFilters(filters);
    }, 300),
    []
  );

  useEffect(() => {
    applyColumnFilters(localColumnFilters);
  }, [localColumnFilters, applyColumnFilters]);

  // Convert custom columns to TanStack Columns
  const columnHelper = createColumnHelper<User>();
  const tableColumns = useMemo<ColumnDef<User, any>[]>(() => {
    return columns.map((col) => ({
      id: typeof col.accessor === 'string' ? col.accessor : (col.accessor as string),
      header: col.header,
      accessorKey: typeof col.accessor === 'string' ? col.accessor : undefined,
      cell: col.renderCell
        ? ({ getValue, row }) => col.renderCell!(getValue(), row.original)
        : ({ getValue }) => getValue(),
      enableSorting: col.sortable ?? false,
    }));
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

  const handleFilterIconClick = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    setFilterMenuOpen((prev) => (prev === columnId ? null : columnId));
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setLocalColumnFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  const clearFilter = (columnId: string) => {
    setLocalColumnFilters((prev) => ({ ...prev, [columnId]: '' }));
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Global Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Global search..."
          value={localGlobalSearch}
          onChange={(e) => setLocalGlobalSearch(e.target.value)}
        />
      </div>

      <table style={{ position: 'relative' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                const colDef = columns.find((c) => c.accessor === header.column.id);
                const isFilterable = colDef?.filterable;
                const currentFilterValue = localColumnFilters[header.column.id] || '';

                return (
                  <th key={header.id} style={{ position: 'relative', padding: '0.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {/* Click text to sort */}
                      <span
                        style={{ cursor: canSort ? 'pointer' : 'default' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canSort) {
                            header.column.toggleSorting();
                          }
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDir === 'asc' && ' 🔼'}
                        {sortDir === 'desc' && ' 🔽'}
                      </span>

                      {isFilterable && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {/* Search icon to open menu */}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handleFilterIconClick(e, header.column.id)}
                          >
                            <Search size={16} />
                          </span>

                          {/* Clear icon if input not empty */}
                          {currentFilterValue && (
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                clearFilter(header.column.id);
                              }}
                            >
                              <X size={16} />
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {filterMenuOpen === header.column.id && (
                      <div
                        ref={filterMenuRef}
                        style={{
                          position: 'absolute',
                          background: '#fff',
                          border: '1px solid #ccc',
                          padding: '0.5rem',
                          top: '100%',
                          left: 0,
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <input
                          type="text"
                          value={currentFilterValue}
                          onChange={(e) => handleFilterChange(header.column.id, e.target.value)}
                          style={{ padding: '4px' }}
                        />
                        {currentFilterValue && (
                          <button
                            onClick={() => {
                              clearFilter(header.column.id);
                            }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    )}
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
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
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
        <button
          onClick={() => setPage((old) => Math.min(old + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
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
