'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, Spinner, TableCell, Input, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';

import { getCompanies, addCompany, updateCompany, deleteCompany } from '../../helper/api';
import { SearchIcon } from '../../button-icon/searchIcon';
import { faDownload, faEye, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { bufferToBase64 } from '../../helper';
import { toast } from 'react-toastify';
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const [errors, setErrors] = useState({
        companyName: '',
        taxCode: '',
        email: '',
        phoneNumber: ''
    });
    const columns = [
        { name: "TÊN DOANH NGHIỆP", uid: "conpanyName" },
        { name: "MÃ SỐ DOANH NGHIỆP", uid: "taxCode" },
        { name: "EMAIL", uid: "email" },
        { name: "SỐ ĐIỆN THOẠI", uid: "phoneNumber" },
        { name: "", uid: "actions" },
    ];

    var getData = useCallback(async () => {
        setLoading(true);
        // Example static data
        var data = await getCompanies();
        setCompanies(data);
        setLoading(false);

    }, [getCompanies]);

    useEffect(() => {
        // Fetch the company data from an API or define it statically
        getData();
    }, [getData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCompany({ ...newCompany, [name]: value });
    };

    const validateForm = async () => {
        const currentCompanies = await getCompanies();

        // Kiểm tra email và taxCode đã tồn tại chưa
        const emailExists = currentCompanies.some(company =>
            company.email.toLowerCase() === newCompany.email.toLowerCase() &&
            company.companyID !== newCompany.companyID
        );
    
        const taxCodeExists = currentCompanies.some(company =>
            company.taxCode === newCompany.taxCode &&
            company.companyID !== newCompany.companyID
        );
        let isValid = true;
        const newErrors = {
            companyName: '',
            taxCode: '',
            email: '',
            phoneNumber: ''
        };

        if (!newCompany.companyName.trim()) {
            newErrors.companyName = 'Tên doanh nghiệp không được để trống';
            isValid = false;
        }

        if (!newCompany.taxCode.trim()) {
            isValid = false;
            newErrors.taxCode = 'Mã số thuế không được để trống';
        } else if (taxCodeExists) {
            isValid = false;
            newErrors.taxCode = 'Mã số thuế đã tồn tại';
        }

        if (!newCompany.email.trim()) {
            isValid = false;
            newErrors.email = 'Email không được để trống';
        } else if (emailExists) {
            isValid = false;
            newErrors.email = 'Email đã tồn tại';
        } else {
            //định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newCompany.email)) {
                isValid = false;
                newErrors.email = 'Email không đúng định dạng';
            }
        }

        if (!newCompany.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
            isValid = false;
        } 
        // else {
        //     const phoneRegex = /^[0-9]+$/; 
        //     const phoneLengthRegex = /^\d{10}$/;

        //     if (!newCompany.test(newCompany.phoneNumber)) {
        //         newErrors.phoneNumber = 'Số điện thoại chỉ được chứa số';
        //         isValid = false;
        //     } else if (!phoneLengthRegex.test(newCompany.phoneNumber)) {
        //         newErrors.phoneNumber = 'Số điện thoại phải chứa đúng 10 chữ số';
        //         isValid = false;
        //     }
        // }
        setErrors(newErrors);
        return isValid;
    }
    const handleAddCompany = async (e) => {

        const isValid = await validateForm();
        if (isValid) {
            setLoading(true);
            try {
                var rs = await addCompany(newCompany);
                if (rs) {
                    setNewCompany({ companyID: 0, companyName: '', taxCode: '', email: '', phoneNumber: '' });
                    await getData();
                    onOpenChange();
                } else {
                    alert('Thêm mới doanh nghiệp thất bại');
                }
            } catch (error) {
                console.error('Error adding company:', error);
                alert('Có lỗi xảy ra khi thêm mới doanh nghiệp');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const dataFiltered = companies.filter(company =>
            company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompany(dataFiltered)
    }, [companies, searchTerm]);
    const handleEditCompany = async (company) => {
        console.log("delte",company)
        setNewCompany({
            companyID: company.companyID,
            companyName: company.companyName,
            taxCode: company.taxCode,
            email: company.email,
            phoneNumber: company.phoneNumber
        });
        setIsEditMode(true);
        onOpen();
    };
    const handleUpdateCompany = async () => {
        const isValid = await validateForm();
        if (isValid) {
            setLoading(true);
            try {
                const companyIdString = newCompany.companyID.toString();
                
                const { ...dataToUpdate } = newCompany;
                
                var rs = await updateCompany(companyIdString, dataToUpdate);
                if (rs) {
                    setNewCompany({ companyID: 0, companyName: '', taxCode: '', email: '', phoneNumber: '' });
                    await getData();
                    onOpenChange();
                    setIsEditMode(false);
                    toast.success('Cập nhật doanh nghiệp thành công');
                } else {
                    toast.error('Cập nhật doanh nghiệp thất bại');
                }
            } catch (error) {
                
                console.log(error.message || 'Có lỗi xảy ra khi cập nhật doanh nghiệp');
            } finally {
                setLoading(false);
            }
        }
    };
    const handleDeleteCompany = async (companyId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa doanh nghiệp này không?')) {
            setLoading(true);
            try {
                var rs = await deleteCompany(companyId);
                if (rs) {
                    await getData();
                    toast.success('Xóa doanh nghiệp thành công');
                } 
            } catch (error) {
                
                toast.error('Có lỗi xảy ra khi xóa doanh nghiệp');
            } finally {
                setLoading(false);
            }
        }
    };
    const pages = Math.ceil(filteredCompanies.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredCompanies.slice(start, end);
    }, [page, filteredCompanies]);

    const exportToPDF = async () => {
        const doc = new jsPDF();


        const response = await fetch("/fonts/NotoSans-Regular.ttf ");
        const fontData = await response.arrayBuffer();

        // Convert font data to Base64
        const base64Font = bufferToBase64(fontData);

        // Add the font to jsPDF
        doc.addFileToVFS("NotoSans-Regular.ttf", base64Font);
        doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");

        // Đặt font mặc định là NotoSans
        doc.setFont("NotoSans");

        // Thêm tiêu đề
        doc.text('DANH SÁCH DOANH NGHIỆP', 15, 10);
        doc.autoTable({
            head: [['Tên doanh nghiệp', 'Mã số thuế', 'Email', 'Số điện thoại']],
            styles: {
                font: "NotoSans", // Use the custom font
                fontSize: 13,
            },
            body: items.map(item => [
                item.companyName,
                item.taxCode,
                item.email,
                item.phoneNumber
            ]),
        });
        doc.save('company.pdf');
    };
 
    return (
        <>
            {loading ? (<div class="flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>) :
            (
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

                    <Button size='lg' className='mb-4' color='primary' onClick={onOpen}> <FontAwesomeIcon icon={faPlus} /> Thêm mới</Button>
                    <Button size='lg' className='mb-4 ml-3 bg-red-400' color='primary' onClick={exportToPDF}> <FontAwesomeIcon icon={faDownload} />Export to PDF</Button>
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
                                    <ModalHeader className="flex flex-col gap-1">
                                        {isEditMode ? 'Sửa thông tin doanh nghiệp' : 'Thêm mới doanh nghiệp'}
                                    </ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={handleAddCompany}>
                                            <div className="mb-2">
                                                <label className="block text-gray-700">Tên doanh nghiệp<span className='text-red-500'>*</span></label>
                                                <Input
                                                    type="text"
                                                    name="companyName"
                                                    value={newCompany.companyName}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        setErrors({ ...errors, companyName: '' });
                                                    }}
                                                    fullWidth
                                                    isInvalid={!!errors.companyName}
                                                    errorMessage={errors.companyName}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-gray-700">Mã số thuế<span className='text-red-500'>*</span></label>
                                                <Input
                                                    type="text"
                                                    name="taxCode"
                                                    value={newCompany.taxCode}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        setErrors({ ...errors, taxCode: '' });
                                                    }}
                                                    fullWidth
                                                    isInvalid={!!errors.taxCode}
                                                    errorMessage={errors.taxCode}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-gray-700">Email<span className='text-red-500'>*</span></label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={newCompany.email}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        setErrors({ ...errors, email: '' });
                                                    }}
                                                    fullWidth
                                                    isInvalid={!!errors.email}
                                                    errorMessage={errors.email}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-gray-700">Số điện thoại<span className='text-red-500'>*</span></label>
                                                <Input
                                                    type="text"
                                                    name="phoneNumber"
                                                    value={newCompany.phoneNumber}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        setErrors({ ...errors, phoneNumber: '' });
                                                    }}
                                                    fullWidth
                                                    isInvalid={!!errors.phoneNumber}
                                                    errorMessage={errors.phoneNumber}
                                                />
                                            </div>
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={isEditMode ? handleUpdateCompany : handleAddCompany}>
                                            {isEditMode ? 'Cập nhật' : 'Lưu lại'}
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
                            <TableColumn key="actions">THAO TÁC</TableColumn>
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <TableRow key={item.companyID}>
                                    <TableCell>{item.companyName}</TableCell>
                                    <TableCell>{item.taxCode}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phoneNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                isIconOnly
                                                color="primary"
                                                variant="light"
                                                onClick={() => handleEditCompany(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="light"
                                                onClick={() => handleDeleteCompany(item.companyID)}
                                            >
                                            Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

            )
            }
        </>
    );
}