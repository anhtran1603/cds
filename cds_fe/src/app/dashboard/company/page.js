'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Modal, ModalContent,  ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';

import { getCompanies, addCompany } from '../../helper/api';
import { SearchIcon } from '../../button-icon/searchIcon';

export default function Page() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCompany, setNewCompany] = useState({
        companyID: 0,
        companyName: '',
        taxCode: '',
        email: '',
        phoneNumber: ''
    });
    const [filteredCompanies, setFilteredCompany] = useState([]);

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const columns = [
        { name: "TÊN DOANH NGHIỆP", uid: "conpanyName" },
        { name: "MÃ SỐ DOANH NGHIỆP", uid: "taxCode" },
        { name: "EMAIL", uid: "email" },
        { name: "SỐ ĐIỆN THOẠI", uid: "phoneNumber" },
        { name: "", uid: "actions" },
    ];

    var getData = useCallback(async () => {
        // Example static data
        var data = await getCompanies();
        setCompanies(data);
    }, [getCompanies]);

    useEffect(() => {
        // Fetch the company data from an API or define it statically
        getData();
    }, [getData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCompany({ ...newCompany, [name]: value });
    };

    const handleAddCompany = async (e) => {
        var rs = await addCompany(newCompany);
        if (rs) {
            setNewCompany({ companyID: 0, companyName: '', taxCode: '', email: '', phoneNumber: '' });
            getData();
            // window.location.reload();
            onOpenChange();
        } else {
            alert('Thêm mới doanh nghiệp thất bại');
        }
    };

    useEffect(() => {
        const dataFiltered = companies.filter(company =>
            company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompany(dataFiltered)
    }, [companies, searchTerm]);

    const pages = Math.ceil(filteredCompanies.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredCompanies.slice(start, end);
    }, [page, filteredCompanies]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách doanh nghiệp</h1>
            <div className="flex justify-between mb-4">

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

            </div>
            
            <Button size='lg' className='mb-4' color='primary' onClick={onOpen}>Thêm mới</Button>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Thêm mới doanh nghiệp</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleAddCompany}>
                                    <div className="mb-2">
                                        <label className="block text-gray-700">Tên doanh nghiệp<p className='text-danger-50'>*</p></label>
                                        <Input
                                            type="text"
                                            name="companyName"
                                            value={newCompany.companyName}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700">Mã số thuế<p className='text-danger-50'>*</p></label>
                                        <Input
                                            type="text"
                                            name="taxCode"
                                            value={newCompany.taxCode}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700">Email<p className='text-danger-50'>*</p></label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={newCompany.email}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700">Số điện thoại <p className='text-danger-50'>*</p></label>
                                        <Input
                                            type="text"
                                            name="phoneNumber"
                                            value={newCompany.phoneNumber}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handleAddCompany}>
                                    Lưu lại
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Table
                aria-label="Company List"
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
                classNames={{
                    wrapper: "min-h-[222px] border border-gray-300 rounded-lg shadow-md",
                    table: "w-full text-left",
                    header: "bg-blue-100 text-blue-700",
                    row: "hover:bg-blue-50",
                    cell: "p-4 border-b border-gray-200",
                }}
            >
                <TableHeader>
                    <TableColumn key="companyName">TÊN DOANH NGHIỆP</TableColumn>
                    <TableColumn key="taxCode">MÃ SỐ THUẾ</TableColumn>
                    <TableColumn key="email">EMAIL</TableColumn>
                    <TableColumn key="phoneNumber">SỐ ĐIỆN THOẠI</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.taxCode}>
                            <TableCell>{item.companyName}</TableCell>
                            <TableCell>{item.taxCode}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.phoneNumber}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}