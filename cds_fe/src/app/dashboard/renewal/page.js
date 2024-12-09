'use client'
import { useState, useEffect, useMemo, React, useCallback } from 'react';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Tooltip, Input, Button, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { EditIcon } from "../../button-icon/editIcon";
import { DeleteIcon } from "../../button-icon/deleteIcon";
import { EyeIcon } from "../../button-icon/viewIcon";
import { SearchIcon } from '../../button-icon/searchIcon';
import { useRouter } from 'next/navigation';
import { getApplications, getCompany } from '../../helper/api';

export default function Page() {
    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();
    const rowsPerPage = 10;

    const pages = Math.ceil(applications.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return applications.slice(start, end);
    }, [page, applications]);

    var status = [ // Example data for Autocomplete
        { label: "Chờ xử lý", value: "Chờ sử lý" },
        { label: "Đang xử lý", value: "Đang xử lý" },
        { label: "Đã xử lý", value: "Đã xử lý" },
        { label: "Đã duyệt", value: "Đã duyệt" },
        { label: "Đã hoàn thành", value: "Đã hoàn thành" },
    ];

    const columns = [
        { name: "MÃ HỒ SƠ", uid: "applicationID" },
        { name: "TÊN DOANH NGHIỆP", uid: "companyName" },
        { name: "TRẠNG THÁI", uid: "status" },
        { name: "LOẠI HỒ SƠ", uid: "applicationType" },
        { name: "NGÀY TIẾP NHẬN", uid: "submitDate" },
        { name: "", uid: "actions" },
    ];


    const getCompayName = async (id) => {
        try {
            const data = await getCompany(id);
            return data.companyName;
        } catch (error) {
            console.error("error", error);
        }
    }



    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        setUser(user);
        // Fetch the company data from an API or define it statically
        var getData = async () => {
            var data = await getApplications();
            setApplications(data.filter((app) => app.applicationType === "Cấp lại"));
        }

        getData();
    }, [getApplications]);

    const renderCell = useCallback((application, columnKey) => {
        const cellValue = application[columnKey];
        const maHS = application.applicationID;
        switch (columnKey) {
            case "companyName":
                return <span> {
                    getCompayName(application.companyID)
                }</span>
            case "submitDate":
                return new Date(cellValue).toLocaleDateString();
            case "actions":
                return (
                    <div className="relative flex justify-end items-end gap-2">
                        <Tooltip content="Xem chi tiết">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon onClick={() => { router.push(`/dashboard/new/${maHS}`) }} />
                            </span>
                        </Tooltip>
                        {
                            application.status === "Chờ xử lý" && user.roleId == '1' &&(
                                <>
                                    <Tooltip content="Chỉnh sửa">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <EditIcon />
                                        </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Xóa">
                                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                            <DeleteIcon />
                                        </span>
                                    </Tooltip>
                                </>
                            )
                        }

                    </div>
                );
            default:
                return cellValue;
        }
    }, [getCompayName]);

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Danh sách hồ sơ cấp lại</h1>
            <div className="flex justify-between mb-4 grid-cols-2 gap-4">
                <Input
                    label="Tìm kiếm"
                    isClearable
                    radius="lg"
                    placeholder="Nhập từ khóa để tìm kiếm..."

                    startContent={
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex justify-between mb-2">
                    <Autocomplete
                        label="Chọn trạng thái"
                        className="max-w-xs"
                    >
                        {status.map((st) => (
                            <AutocompleteItem key={st.value} value={st.value}>
                                {st.label}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </div>
            <Button isDisabled={user?.roleId != '1'} size='lg' className='mb-4' color='primary' onClick={() => { router.push('/dashboard/new/add') }}>Thêm mới</Button>
            <Table aria-label="Example table with custom cells"
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
                        <TableRow key={item.applicationID}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}