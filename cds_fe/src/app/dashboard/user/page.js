'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input,Spinner, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';

import { getUsers, addUser, updateUser, deleteUser } from '../../helper/api';
import { SearchIcon } from '../../button-icon/searchIcon';
import { faDownload, faEye, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { bufferToBase64 } from '../../helper';

export default function Page() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({
        userID: 0,
        fullName: '',
        email: '',
        phoneNumber: '',
        roleID: '',
        userName: '',
        passwordHash: ''
    });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        roleID: 0,
        userName: '',
        passwordHash: ''
    });
    const columns = [
        { name: "HỌ VÀ TÊN", uid: "fullName" },
        { name: "EMAIL", uid: "email" },
        { name: "SỐ ĐIỆN THOẠI", uid: "phoneNumber" },
        { name: "VAI TRÒ", uid: "roleID" },
        { name: "TÊN ĐĂNG NHẬP", uid: "userName" },
        { name: "", uid: "actions" },
    ];

    var getData = useCallback(async () => {
        setLoading(true);
        var data = await getUsers();
        setUsers(data);
        setLoading(false);
    }, [getUsers]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const showAddModal = async (e) => {
        setNewUser({
            userID: 0,
            fullName: '',
            email: '',
            phoneNumber: '',
            roleID: '',
            userName: '',
            passwordHash: ''
        });
        onOpen()
    }
    const validateForm = async () => {
        const currentUsers = await getUsers();

        const emailExists = currentUsers.some(user =>
            user.email.toLowerCase() === newUser.email.toLowerCase() &&
            user.userID !== newUser.userID
        );

        const usernameExists = currentUsers.some(user =>
            user.userName === newUser.userName &&
            user.userID !== newUser.userID
        );

        let isValid = true;
        const newErrors = {
            fullName: '',
            email: '',
            phoneNumber: '',
            roleID: 0,
            userName: '',
            passwordHash: ''
        };

        if (!newUser.fullName.trim()) {
            newErrors.fullName = 'Tên không được để trống';
            isValid = false;
        }

        if (!newUser.userName.trim()) {
            isValid = false;
            newErrors.userName = 'Tên đăng nhập không được để trống';
        } else if (usernameExists) {
            isValid = false;
            newErrors.userName = 'Tên đăng nhập đã tồn tại';
        }

        if (!newUser.email.trim()) {
            isValid = false;
            newErrors.email = 'Email không được để trống';
        } else if (emailExists) {
            isValid = false;
            newErrors.email = 'Email đã tồn tại';
        } else {
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUser.email)) {
                isValid = false;
                newErrors.email = 'Email không đúng định dạng';
            }
        }

        if (!newUser.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
            isValid = false;
        } else {
            const phoneRegex = /^[0-9]+$/;
            const phoneLengthRegex = /^\d{10}$/;

            if (!phoneRegex.test(newUser.phoneNumber)) {
                newErrors.phoneNumber = 'Số điện thoại chỉ được chứa số';
                isValid = false;
            } else if (!phoneLengthRegex.test(newUser.phoneNumber)) {
                newErrors.phoneNumber = 'Số điện thoại phải chứa đúng 10 chữ số';
                isValid = false;
            }
        }

        if (newUser.roleID == null || typeof newUser.roleID !== 'number' || newUser.roleID <= 0) {
            newErrors.roleID = 'Vai trò không được để trống';
            isValid = false;
        }


        if (!isEditMode && !newUser.passwordHash.trim()) {
            newErrors.passwordHash = 'Mật khẩu không được để trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleAddUser = async (e) => {
        setErrors({
            fullName: '',
            email: '',
            phoneNumber: '',
            roleID: 0,
            userName: '',
            passwordHash: ''
        });
        const isValid = await validateForm();
        if (isValid) {
            setLoading(true);
            try {
                var rs = await addUser(newUser);
                if (rs) {
                    setNewUser({
                        userID: 0,
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        roleID: '',
                        userName: '',
                        passwordHash: ''
                    });
                    await getData();
                    onOpenChange();
                } else {
                    alert('Thêm mới người dùng thất bại');
                }
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Có lỗi xảy ra khi thêm mới người dùng');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const dataFiltered = users.filter(user =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(dataFiltered)
    }, [users, searchTerm]);

    const handleEditUser = async (user) => {
        setErrors({
            fullName: '',
            email: '',
            phoneNumber: '',
            roleID: 0,
            userName: '',
            passwordHash: ''
        });
        setNewUser({
            userID: user.userID,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roleID: user.roleID,
            userName: user.userName,
            passwordHash: user.passwordHash
        });
        setIsEditMode(true);
        onOpen();
    };

    const handleUpdateUser = async () => {
        const isValid = await validateForm();
        if (isValid) {
            setLoading(true);
            try {
                const userIdString = newUser.userID.toString();

                const { ...dataToUpdate } = newUser;

                var rs = await updateUser(userIdString, dataToUpdate);
                if (rs) {
                    setNewUser({
                        userID: 0,
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        roleID: 0,
                        userName: '',
                        passwordHash: ''
                    });
                    await getData();
                    onOpenChange();
                    setIsEditMode(false);
                } else {
                    alert('Cập nhật người dùng thất bại');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                alert(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            setLoading(true);
            try {
                var rs = await deleteUser(userId);
                if (rs) {
                    await getData();
                    alert('Xóa người dùng thành công');
                } else {
                    alert('Xóa người dùng thất bại');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Có lỗi xảy ra khi xóa người dùng');
            } finally {
                setLoading(false);
            }
        }
    };

    const pages = Math.ceil(filteredUsers.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredUsers.slice(start, end);
    }, [page, filteredUsers]);

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
        doc.text('DANH SÁCH NGƯỜI DÙNG', 15, 10);
        doc.autoTable({
            head: [['Họ và tên', 'Email', 'Số điện thoại', 'Vai trò', 'Tên đăng nhập']],
            styles: {
                font: "NotoSans",
                fontSize: 13,
            },
            body: items.map(item => [
                item.fullName,
                item.email,
                item.phoneNumber,
                item.Role?.roleName,
                item.userName
            ]),
        });
        doc.save('users.pdf');
    };

    return (
        <>
            {loading ? (<div class="flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>) :
                (
                    <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
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

                        <Button size='lg' className='mb-4' color='primary' onClick={showAddModal}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm mới
                        </Button>
                        <Button size='lg' className='mb-4 ml-3 bg-red-400' color='primary' onClick={exportToPDF}>
                            <FontAwesomeIcon icon={faDownload} />Export to PDF
                        </Button>
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
                                            {isEditMode ? 'Sửa thông tin người dùng' : 'Thêm mới người dùng'}
                                        </ModalHeader>
                                        <ModalBody>
                                            <form onSubmit={handleAddUser}>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700">Họ và tên<span className='text-red-500'>*</span></label>
                                                    <Input
                                                        type="text"
                                                        name="fullName"
                                                        value={newUser.fullName}
                                                        onChange={(e) => {
                                                            handleInputChange(e);
                                                            setErrors({ ...errors, fullName: '' });
                                                        }}
                                                        fullWidth
                                                        isInvalid={!!errors.fullName}
                                                        errorMessage={errors.fullName}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700">Email<span className='text-red-500'>*</span></label>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={newUser.email}
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
                                                        value={newUser.phoneNumber}
                                                        onChange={(e) => {
                                                            handleInputChange(e);
                                                            setErrors({ ...errors, phoneNumber: '' });
                                                        }}
                                                        fullWidth
                                                        isInvalid={!!errors.phoneNumber}
                                                        errorMessage={errors.phoneNumber}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700">Vai trò<span className='text-red-500'>*</span></label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        name="roleID"
                                                        value={newUser.roleID}
                                                        onChange={(e) => {
                                                            handleInputChange(e);
                                                            setErrors({ ...errors, roleID: '' });
                                                        }}
                                                        fullWidth
                                                        isInvalid={!!errors.roleID}
                                                        errorMessage={errors.roleID}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block text-gray-700">Tên đăng nhập<span className='text-red-500'>*</span></label>
                                                    <Input
                                                        type="text"
                                                        name="userName"
                                                        value={newUser.userName}
                                                        onChange={(e) => {
                                                            handleInputChange(e);
                                                            setErrors({ ...errors, userName: '' });
                                                        }}
                                                        fullWidth
                                                        isInvalid={!!errors.userName}
                                                        errorMessage={errors.userName}
                                                    />
                                                </div>
                                                {isEditMode && (
                                                    <div className="mb-2">
                                                        <label className="block text-gray-700">Mật khẩu<span className='text-red-500'>*</span></label>
                                                        <Input
                                                            type="password"
                                                            name="passwordHash"
                                                            value={newUser.passwordHash}
                                                            onChange={(e) => {
                                                                handleInputChange(e);
                                                                setErrors({ ...errors, passwordHash: '' });
                                                            }}
                                                            disabled={true}
                                                            isInvalid={!!errors.passwordHash}
                                                            errorMessage={errors.passwordHash}
                                                            placeholder="Mật khẩu không thể chỉnh sửa"
                                                            fullWidth
                                                        />
                                                    </div>
                                                )}
                                            </form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Đóng
                                            </Button>
                                            <Button color="primary" onPress={isEditMode ? handleUpdateUser : handleAddUser}>
                                                {isEditMode ? 'Cập nhật' : 'Lưu lại'}
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Table
                            aria-label="User List"
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
                                <TableColumn key="fullName">HỌ VÀ TÊN</TableColumn>
                                <TableColumn key="email">EMAIL</TableColumn>
                                <TableColumn key="phoneNumber">SỐ ĐIỆN THOẠI</TableColumn>
                                <TableColumn key="roleID">VAI TRÒ</TableColumn>
                                <TableColumn key="userName">TÊN ĐĂNG NHẬP</TableColumn>
                                <TableColumn key="passwordHash">Mật khẩu</TableColumn>
                                <TableColumn key="actions">THAO TÁC</TableColumn>
                            </TableHeader>
                            <TableBody items={items}>
                                {(item) => (
                                    <TableRow key={item.userID}>
                                        <TableCell>{item.fullName}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phoneNumber}</TableCell>
                                        <TableCell>{item.role?.roleName}</TableCell>
                                        <TableCell>{item.userName}</TableCell>
                                        <TableCell>{item.passwordHash}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    variant="light"
                                                    onClick={() => handleEditUser(item)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    color="danger"
                                                    variant="light"
                                                    onClick={() => handleDeleteUser(item.userID)}
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
                )}
        </>
    );
}