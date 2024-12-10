'use client'
import React, { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { getCompanyName } from "../../../helper";
import { getEmployee, getLicense } from "../../../helper/api";
import { useRouter, useParams } from "next/navigation";
import { toast } from 'react-toastify';

export default function Page() {

    const { id } = useParams(); // Lấy ID từ URL
    const router = useRouter();
    const [license, setLicense] = useState({});
    const [employee, setEmployee] = useState({});
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {

        const getData = async () => {
            try {
                const data = await getLicense(id);

                setLicense(data);
            } catch (error) {
                console.error("error", error);
            }
        }
        getData();
    }, [id]);

    useEffect(() => {
        const getData = async () => {
            const data = await getEmployee(license.employeeID);
            setEmployee(data);
        }

        if (license.employeeID) {
            getData();
        }
    }, [license.employeeID]);

    useEffect(() => {
        const getData = async () => {
            const data = await getCompanyName(employee.companyID);
            setCompanyName(data);
        }
        if (employee.companyID) {
            getData();
        }
    }, [employee.companyID]);

    return (
        <div>
            <div className="flex items-center justify-between ">
                <h3 className="text-xl font-bold mb-2">Thông tin giấy phép</h3>
                <div className="flex items-center justify-between gap 4">
                    <Button onClick={() => toast.info("Hiện chưa có phôi để in")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        In phôi
                    </Button>
                    <div className="m-2"></div>
                    <Button onClick={() => router.push('/dashboard/license')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-3">
                        Quay lại
                    </Button>
                </div>

            </div>
            <div className="m-2">

                <div className="grid grid-cols-3 gap-4">
                    <div className="mb-2">
                        <Input
                            label="Số giấy phép"
                            type="text"
                            name="licenseNumber"

                            value={license?.licenseNumber}
                            fullWidth
                            isRequired
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">

                        <Input readonly
                            label="Ngày cấp"
                            type="text"
                            name="issueDate"
                            value={new Date(license?.issueDate).toLocaleDateString()}

                            fullWidth
                            isReadOnly
                        />

                    </div>
                    <div className="mb-2">
                        <Input readonly
                            label="Ngày hết hạn"
                            type="text"
                            name="expiryDate"
                            value={new Date(license?.issueDate).toLocaleDateString()}
                            fullWidth
                            isReadOnly
                        />



                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                        <Input readonly
                            label="Cơ quan cấp"
                            type="text"
                            name="issuingAuthority"

                            value={license?.issuingAuthority}
                            fullWidth
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                        <Input readonly
                            label="Người ký"
                            type="text"
                            name="signedBy"

                            value={license?.signedBy}
                            fullWidth
                            isReadOnly
                        />
                    </div>

                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                        <Input readonly
                            label="Trạng thái"
                            type="text"
                            name="staus "

                            value={license?.status}
                            fullWidth
                            isReadOnly
                        />
                    </div>
                </div>
            </div>
            <div className="m-2">
                <h3 className="text-xl font-bold mb-2">Thông tin người lái tàu</h3>
                <div className="mb-4 float-start text-center mt-4 mr-4">
                    <Image
                        isBlurred
                        width={256}
                        src={employee?.avatar ? employee.avatar : "/assets/noimage.jpg"}
                        alt="avatar"

                    />

                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">

                    <div className="mb-2">

                        <Input
                            label="Mã số cá nhân"
                            type="text"
                            name="citizenID"
                            value={employee?.citizenID}

                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Họ và tên</label> */}
                        <Input
                            label="Họ và tên"
                            type="text"
                            name="fullName"
                            value={employee?.fullName}

                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Ngày sinhh</label> */}
                        <Input
                            label="Ngày sinh"
                            type="text"
                            name="dateOfBirth"
                            value={new Date(employee?.dateOfBirth).toLocaleDateString()}

                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Số điện thoại</label> */}
                        <Input
                            label="Số điện thoại"
                            type="text"
                            name="phoneNumber"
                            value={employee?.phoneNumber}

                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        <Input
                            label="Loại chuyên môn"
                            type="text"
                            name="licenseType"
                            value={employee?.licenseType}
                            //
                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">


                        <Input
                            label="Loại tuyến đường sắt"
                            type="text"
                            name="railwayType"
                            value={employee?.railwayType}
                            //
                            fullWidth
                            required
                            isReadOnly
                        />
                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Đơn vị công tác</label> */}
                        <Input
                            label="Đơn vị công tác"
                            type="text"
                            name="companyID"
                            value={companyName}

                            fullWidth
                            required
                            isReadOnly
                        />

                    </div>
                    <div className="mb-2">
                        {/* <label className="block text-gray-700">Đơn vị công tác</label> */}
                        <Input
                            label="Trạng thái"
                            type="text"
                            name="status"
                            value={employee.status}

                            fullWidth
                            required
                            isReadOnly
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}