'use client'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Tooltip, AutocompleteItem, Autocomplete } from '@nextui-org/react';
import { EyeIcon } from "../../button-icon/viewIcon";
import { SearchIcon } from '../../button-icon/searchIcon';
import { getEmployees, getCompany ,getAllEmployees} from '../../helper/api';
import { useRouter } from 'next/navigation';
export default function TrainDriversPage() {
    const rourer = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
  
    const [employees, setEmployees] = useState([]);

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const columns = [
        { name: "CCCD", uid: "citizenID" },
        { name: "Họ và tên", uid: "fullName" },
        { name: "Đơn vị công tác", uid: "companyId" },
        { name: "Trạng thái", uid: "status" },
        { name: "Chuyên môn", uid: "licenseType" },
        { name: "", uid: "actions" },
    ];
    const filteredDrivers = employees.filter(driver =>
        driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pages = Math.ceil(employees.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredDrivers.slice(start, end);
    }, [page, filteredDrivers]);

    useEffect(() => {
        // Fetch the driver data from an API or define it statically
        const getData = async () => {

            const data = await getAllEmployees();
            setEmployees(data);

        }
        getData()
        // fetchDrivers();
    }, []);


    const getCompayName = async (id) => {
        try {
            const data = await getCompany(id);
            return data.companyName;
        } catch (error) {
            console.error("error", error);
        }
    }


    const renderCell = useCallback((employee, columnKey) => {
        const cellValue = employee[columnKey];
        const maHS = employee.employeeID;
        switch (columnKey) {
            case "compnyID":
                return <span> {
                    getCompayName(employee.companyID)
                }</span>

            case "actions":
                return (
                    <div className="relative flex justify-end items-end gap-2">
                        <Tooltip content="Xem chi tiết">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon onClick={() => rourer.push(`/dashboard/employee/${employee.employeeID}`)} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [getCompayName]);

    const status = [ // Example data for Autocomplete   
        { label: "Đang công tác", value: "Đang công tác" },
        { label: "Đã nghỉ việc", value: "Đã nghỉ việc" },
    ]

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách người lái tàu</h1>
            <div className="flex justify-between mb-4">
                <Input
                    label="Tìm kiếm"
                    radius='lg'
                    clearable
                    underlined
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
                <div className="flex justify-between ml-5 mb-2">
                    <Autocomplete
                        label="Chọn trạng thái"
                        className="max-w-xs"
                        onSelectionChange={(value) => {
                            console.log("Selected value", value);
                        }
                        }
                    >
                        {status.map((st) => (
                            <AutocompleteItem key={st.value} value={st.value}>
                                {st.label}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </div>

            <Table aria-label=""
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }>
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.employeeID}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* <Table
                aria-label="Train Drivers List"
                classNames={{
                    wrapper: "min-h-[222px] border border-gray-300 rounded-lg shadow-md",
                    table: "w-full text-left",
                    header: "bg-blue-100 text-blue-700",
                    row: "hover:bg-blue-50",
                    cell: "p-4 border-b border-gray-200",
                }}
            >
                <TableHeader>
                    <TableColumn key="cccd">CCCD</TableColumn>
                    <TableColumn key="fullName">Họ tên</TableColumn>
                    <TableColumn key="workUnit">Đơn vị công tác</TableColumn>
                    <TableColumn key="status">Trạng thái</TableColumn>
                    <TableColumn key="specialization">Chuyên môn</TableColumn>
                </TableHeader>
                <TableBody items={filteredDrivers}>
                    {(item) => (
                        <TableRow key={item.citizenID}>
                            <TableCell>{item.citizenID}</TableCell>
                            <TableCell>{item.fullName}</TableCell>
                            <TableCell>{getCompayName(item.companyID)}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.licenseType}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table> */}
        </div>
    );
}