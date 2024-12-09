'use client'
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Modal, AutocompleteItem, Autocomplete } from '@nextui-org/react';
import { EyeIcon } from "../../button-icon/viewIcon";
import { SearchIcon } from '../../button-icon/searchIcon';
export default function TrainDriversPage() {
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDriver, setNewDriver] = useState({
        cccd: '',
        fullName: '',
        workUnit: '',
        status: '',
        specialization: ''
    });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Fetch the driver data from an API or define it statically
        const fetchDrivers = async () => {
            // Example static data
            const data = [
                { cccd: '123456789', fullName: 'Nguyễn Văn Anh', workUnit: 'Công ty than Hồng Thái', status: 'Đang làm việc', specialization: 'Chuyên môn A' },
                { cccd: '987654321', fullName: 'Lê Đăng Dương', workUnit: 'Công ty tập đoàn Trí Nam', status: 'Đang làm việc', specialization: 'Chuyên môn B' },
                // Add more drivers as needed
            ];
            setDrivers(data);
        };

        fetchDrivers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDriver({ ...newDriver, [name]: value });
    };

    const handleAddDriver = (e) => {
        e.preventDefault();
        setDrivers([...drivers, { ...newDriver, id: drivers.length + 1 }]);
        setNewDriver({ cccd: '', fullName: '', workUnit: '', status: '', specialization: '' });
        setVisible(false);
    };

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const filteredDrivers = drivers.filter(driver =>
        driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const status = [ // Example data for Autocomplete   
        { label: "Đang làm việc", value: "Đang làm việc" },
        { label: "Nghỉ việc", value: "Nghỉ việc" },
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
                    >
                        {status.map((st) => (
                            <AutocompleteItem key={st.value} value={st.value}>
                                {st.label}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </div>
            {/* <Button onClick={openModal}>Thêm mới</Button> */}
            {/* <Modal open={visible} onClose={closeModal}>
                <Modal.Header>
                    <h2 className="text-xl font-bold">Thêm người lái tàu mới</h2>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleAddDriver}>
                        <div className="mb-2">
                            <label className="block text-gray-700">CCCD</label>
                            <Input
                                type="text"
                                name="cccd"
                                value={newDriver.cccd}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Họ tên</label>
                            <Input
                                type="text"
                                name="fullName"
                                value={newDriver.fullName}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Đơn vị công tác</label>
                            <Input
                                type="text"
                                name="workUnit"
                                value={newDriver.workUnit}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Trạng thái</label>
                            <Input
                                type="text"
                                name="status"
                                value={newDriver.status}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Chuyên môn</label>
                            <Input
                                type="text"
                                name="specialization"
                                value={newDriver.specialization}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </div>
                        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Thêm người lái tàu
                        </Button>
                    </form>
                </Modal.Body>
            </Modal> */}
            <Table
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
                        <TableRow key={item.cccd}>
                            <TableCell>{item.cccd}</TableCell>
                            <TableCell>{item.fullName}</TableCell>
                            <TableCell>{item.workUnit}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.specialization}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}