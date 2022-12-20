
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { useMemo, Fragment, useCallback, ReactNode } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";




// const getColumns = () => [
//   {
//     Header: "Name",
//     accessor: "name",
//     width: "300px",
//     Cell: ({ row, value }) => {
//       return (
//         <div className="flex gap-2 items-center">
//           <Avatar src={row.original.image} alt={`${value}'s Avatar`} />
//           <div>{value}</div>
//         </div>
//       );
//     },
//   },
//   {
//     Header: "Account Number",
//     accessor: "accountNumber",
//   },
//   {
//     Header: "Account Name",
//     accessor: "accountName",
//   },
//   {
//     Header: "Amount",
//     accessor: "amount",
//   },
// ];

function TableInputGroup({
  label,
  name,
  value,
  onChange,
  type = "text",
  decoration,
  className = "",
  inputClassName = "",
  decorationClassName = "",
  disabled =false,
}:{
    label?:string,
    name?:string,
    value?:any,
    onChange?:(e:any)=>void,
    type?:string,
    decoration?:any,
    className?:string,
    inputClassName?:string,
    decorationClassName?:string,
    disabled?:boolean
}) {
  return (
    <div
      className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}
    >
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        className={`input input-bordered rounded-md peer block w-full m-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none ${
          disabled ? "bg-gray-200" : ""
        } ${inputClassName}`}
        disabled={disabled}
      />
      <div
        className={`flex items-center pl-3 pr-3 py-3 text-gray-600 ${
          disabled ? "bg-gray-200" : ""
        } ${decorationClassName}`}
      >
        {decoration}
      </div>
    </div>
  );
}

function TableGlobalSearchFilter({
  globalFilter,
  setGlobalFilter,
  className = "",
}:{
    globalFilter?:string,setGlobalFilter:(v:string)=>void,className?:string
}) {
  return (
    <TableInputGroup
      name="search"
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      label="Search"
      decoration={<FaSearch size="1rem" className="text-gray-400" />}
      className={className}
    />
  );
}

function TableSelectMenu({ value, 
    setValue, 
    options, 
    className = "",
     disabled }:{
        value:any,
        setValue?:(e:any)=>void,
        options:{label:string,value:any}[],
     className?:string,
     disabled?:boolean}) {
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );
  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <div className={`relative input input-bordered w-full ${className}`}>
        <Listbox.Button
          className={`relative w-full  rounded-xl py-3 pl-3 pr-10 text-base text-gray-700 text-left shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none
          ${
            disabled
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white cursor-default"
          }
        
        `}
        >
          <span className="block truncate">{selectedOption?.label??""}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown
              size="0.80rem"
              className="text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-3 pl-10 pr-4 ${
                    active ? "bg-red-100" : ""
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                        <FaCheck size="0.5rem" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function TableNavButton({ content, onClick, active, disabled }:{
    content?:ReactNode,
    onClick:(e:any)=>void,
    active?:boolean,
    disabled?:boolean
}) {
  return (
    <button
      className={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-lg
      ${active ? "bg-red-500 text-white" : "text-red-500"}
      ${
        !disabled
          ? "bg-white hover:bg-red-500 hover:text-white"
          : "text-red-300 bg-white cursor-not-allowed"
      }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

function TablePaginationNav({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
}:{
    gotoPage:(i:number)=>void,
    canPreviousPage:boolean,
    canNextPage:boolean,
    pageCount:number,
    pageIndex:number,
}) {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 3;
    let numberOfButtons =
      pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
      if (
        pageNumberBefore >= 0 &&
        (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
      ) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <TableNavButton
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
        />
      </li>
    ));
  }, [pageCount, pageIndex]);
  return (
    <ul className="flex gap-2">
      <li>
        <TableNavButton
          content={
            <div className="flex ml-1">
              <FaChevronLeft size="0.6rem" />
              <FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <TableNavButton
          content={
            <div className="flex ml-1">
              <FaChevronRight size="0.6rem" />
              <FaChevronRight size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </li>
    </ul>
  );
}

function TableComponent({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
}:{
  getTableProps:()=>any,
  headerGroups:any[],
  getTableBodyProps:()=>any,
  rows:any[],
  prepareRow:(v:any)=>void,
}) {
  return (
    <div className="w-full min-w-[30rem] p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
      <table {...getTableProps()} className="table w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column:any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-3 text-start text-xs font-light uppercase cursor-pointer"
                  style={{ width: column.width }}
                >
                  <div className="flex gap-2 items-center">
                    <div className="text-gray-600">
                      {column.render("Header")}
                    </div>
                    {!column.disableSortBy&&
                    <div className="flex flex-col">
                      <FaSortUp
                        className={`text-sm translate-y-1/2 ${
                          column.isSorted && !column.isSortedDesc
                            ? "text-red-400"
                            : "text-gray-300"
                        }`}
                      />
                      <FaSortDown
                        className={`text-sm -translate-y-1/2 ${
                          column.isSortedDesc ? "text-red-400" : "text-gray-300"
                        }`}
                      />
                    </div>
                    }
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export function CustomTable({rowsData,collumsData,pageOptions}:{rowsData:any[],collumsData:()=>{Header:any,accessor?:string,Cell?:any}[],pageOptions:{value:number,label:string}[]}) {
  const data = useMemo(() => rowsData, []);
  const columns = useMemo(collumsData, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page: rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-center">
        <TableGlobalSearchFilter
          className="sm:w-64"
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <TableSelectMenu
          className="sm:w-44"
          value={pageSize}
          setValue={setPageSize}
          options={pageOptions}
        />
      </div>
      <TableComponent
        getTableProps={getTableProps}
        headerGroups={headerGroups}
        getTableBodyProps={getTableBodyProps}
        rows={rows}
        prepareRow={prepareRow}
      />
      <div className="flex justify-center">
        <TablePaginationNav
          gotoPage={gotoPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
        />
      </div>
    </div>
  );
}



