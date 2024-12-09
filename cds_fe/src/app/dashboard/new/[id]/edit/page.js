'use client'
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

export default function Page() {
    const [newApplication, setNewApplication] = useState({
        applicationID: '',
        companyID: '',
        taxCode: '',
        submitName: '',
        submitDate: '',
        status: '',
        email: '',
        phoneNumber: '',
        requestForm: '',
        certificationDocument: '',
        employees: [
            { name: '', qualification: '', licenseType: '', vehicle: '', result: '' }
        ]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewApplication({ ...newApplication, [name]: value });
    };

    const handleEmployeeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEmployees = [...newApplication.employees];
        updatedEmployees[index][name] = value;
        setNewApplication({ ...newApplication, employees: updatedEmployees });
    };

    const addEmployee = () => {
        setNewApplication({
            ...newApplication,
            employees: [...newApplication.employees, { name: '', qualification: '', licenseType: '', vehicle: '', result: '' }]
        });
    };

    const handleAddApplication = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log('New Application:', newApplication);
        // Reset the form
        setNewApplication({
            applicationID: '',
            companyID: '',
            taxCode: '',
            submitName: '',
            submitDate: '',
            status: '',
            email: '',
            phoneNumber: '',
            requestForm: '',
            certificationDocument: '',
            employees: [
                { name: '', qualification: '', licenseType: '', vehicle: '', result: '' }
            ]
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm mới hồ sơ</h1>
            <form onSubmit={handleAddApplication}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="mb-2">
                        <label className="block text-gray-700">Application ID</label>
                        <Input
                            type="text"
                            name="applicationID"
                            value={newApplication.applicationID}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Company ID</label>
                        <Input
                            type="text"
                            name="companyID"
                            value={newApplication.companyID}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Tax Code</label>
                        <Input
                            type="text"
                            name="taxCode"
                            value={newApplication.taxCode}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Submit Name</label>
                        <Input
                            type="text"
                            name="submitName"
                            value={newApplication.submitName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Submit Date</label>
                        <Input
                            type="date"
                            name="submitDate"
                            value={newApplication.submitDate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Status</label>
                        <Input
                            type="text"
                            name="status"
                            value={newApplication.status}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={newApplication.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Phone Number</label>
                        <Input
                            type="text"
                            name="phoneNumber"
                            value={newApplication.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Đơn đề nghị</label>
                        <Input
                            type="text"
                            name="requestForm"
                            value={newApplication.requestForm}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">Văn bản chứng nhận</label>
                        <Input
                            type="text"
                            name="certificationDocument"
                            value={newApplication.certificationDocument}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Danh sách các nhân viên tham gia sát hạch</h2>
                    {newApplication.employees.map((employee, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                            <div className="mb-2">
                                <label className="block text-gray-700">Họ tên</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={employee.name}
                                    onChange={(e) => handleEmployeeChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Trình độ</label>
                                <Input
                                    type="text"
                                    name="qualification"
                                    value={employee.qualification}
                                    onChange={(e) => handleEmployeeChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Loại giấy phép đăng ký</label>
                                <Input
                                    type="text"
                                    name="licenseType"
                                    value={employee.licenseType}
                                    onChange={(e) => handleEmployeeChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Phương tiện</label>
                                <Input
                                    type="text"
                                    name="vehicle"
                                    value={employee.vehicle}
                                    onChange={(e) => handleEmployeeChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Kết quả</label>
                                <Input
                                    type="text"
                                    name="result"
                                    value={employee.result}
                                    onChange={(e) => handleEmployeeChange(index, e)}
                                    fullWidth
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <Button onClick={addEmployee} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                        Thêm nhân viên
                    </Button>
                </div>
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Thêm hồ sơ
                </Button>
            </form>
        </div>
    );
}