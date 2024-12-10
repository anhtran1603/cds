'use client'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Tooltip , AutocompleteItem, Autocomplete } from '@nextui-org/react';
import { EyeIcon } from "../../button-icon/viewIcon";
import { SearchIcon } from '../../button-icon/searchIcon';
import { getLicenses,getEmployee, getLicensesCompleted } from '../../helper/api';
import { useRouter } from 'next/navigation';



export default function Page() {
    const rourer = useRouter();
    const [licenses, setLicenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [trangThai, setTrangThai] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const pages = Math.ceil(licenses.length / rowsPerPage);
    
    const filteredDrivers = licenses.filter(driver =>
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase() && driver.status.toLowerCase() == trangThai.toLowerCase()) 
    );

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredDrivers.slice(start, end);
    }, [page, filteredDrivers]);

    useEffect(() => {
        // Fetch the driver data from an API or define it statically
        const getData = async () => {

            const data =  await getLicensesCompleted();
            setLicenses(data);
        
        }
        getData()
        // fetchDrivers();
    }, []);


    const columns = [
        { name: "Số giấy phép", uid: "licenseNumber" },
        { name: "Họ và tên", uid: "employeeID" },
        { name: "Ngày hết hạn", uid: "expiryDate" },
        { name: "Trạng thái", uid: "status" },
        { name: "", uid: "actions" },
    ];

    // const filteredDrivers = drivers.filter(driver =>
    //     driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const status = [ // Example data for Autocomplete   
        { label: "Hiệu lực", value: "Hiệu lực" },
        { label: "Hết hiệu lực", value: "Hết hiệu lực" },
    ]

    const getEmployeeName = async (id) => {
        try {
            const data = await getEmployee(id);
            return data.fullName;
        } catch (error) {
            console.error("error", error);
        }
    }

    const renderCell = useCallback((license, columnKey) => {
        const cellValue = license[columnKey];
        // const maHS = license.employeeID;
        switch (columnKey) {
            case "employeeID":
                return <span> {
                    getEmployeeName(license.employeeID)
                }</span>
            case "expiryDate":
                return new Date(cellValue).toLocaleDateString();
            case "actions":
                return (
                    <div className="relative flex justify-end items-end gap-2">
                        <Tooltip content="Xem chi tiết">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon onClick={() => rourer.push(`/dashboard/license/${license.licenseID}`)} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [getEmployeeName]);

    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách giấy phép lái tàu</h1>
            <div className="flex justify-between mb-4">
                <Input
                    label="Tìm kiếm"
                    radius='lg'
                    clearable
                    underlined
                    placeholder="Tìm kiếm số giấy phép..."
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
                        onSelectionChange={(value) => setTrangThai(value)}
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
                }
                sortDescriptor={{ key: "licenseNumber", direction: "desc" }}
                >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.licenseNumber}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>               
        </div>
    );
}