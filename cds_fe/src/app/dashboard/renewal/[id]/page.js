'use client'
import { use, useEffect, useState, useCallback } from 'react';
import { Input, Accordion, AccordionItem, Textarea, DateInput, DatePicker, Autocomplete, AutocompleteItem, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, user } from '@nextui-org/react';
import { faDownload, faEye, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CalendarDate, parseDate, parseAbsoluteToLocal, CalendarDateTime } from "@internationalized/date";
import { getEmployees, getApplications, getLicenses, updateApplication, getApplication, getCompanies, getUserByRole, addLicense } from '../../../helper/api';
import { useRouter, useParams } from "next/navigation";
import PhanCongModal from "../../../components/PhanCongModal";
import ReasonModal from "../../../components/ReasonModal";
import { toast } from 'react-toastify';
import UploadFile from '../../../components/uploadFile';
import { handleDownload } from '../../../helper'
// import { getApplications, getLicenses } from '../../../helper/api';

export default function Page() {
    const { id } = useParams(); // Lấy ID từ URL
    const router = useRouter(); // Để điều hướng sau khi submit
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newApplication, setNewApplication] = useState({
        applicationID: '',
        companyID: '',
        taxCode: '',
        submitterName: '',
        submitDate: '',
        status: '',
        email: '',
        phoneNumber: '',
        applicationFile: '',
        applicationFileContent: '',
        certificationDocument: '',
        certificationDocumentContent: '',
        returnDate: "",
        Duration: "",
        appraiser: '',
        appraiserName: '',
        reasonRejection: '',
        status: '',
        examinationPlan: '',
        examinationPlanContent: '',
        result: '',
        resultContent: '',
    });

    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [sunmitDate, setSubmitDate] = useState(null);
    const [companyId, setCompanyId] = useState('1');
    const [isPhanCong, setIsPhanCong] = useState(false);
    const [users, setUsers] = useState([]);
    const [isReason, setIsReason] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [examinationPlan, setExaminationPlan] = useState(null);
    const [examinationPlanContent, setExaminationPlanContent] = useState(null);
    const [result, setResult] = useState(null);

    const [resultContent, setResultContent] = useState(null);


    const [newLicense, setNewLicense] = useState({
        licenseNumber: '',
        employeeID: '',
        issueDate: '',
        expiryDate: '',
        issuingAuthority: '',
        signedBy: '',
        status: '',
    });


    useEffect(() => {

        var getUsers = async () => {
            var data = await getUserByRole(2);
            setUsers(data);
        }

        getUsers();

    }, [])

    useEffect(() => {

        var getData = async () => {
            const data = await getCompanies();
            setCompanies(data);
        }

        getData()

    }, [getCompanies]);

    useEffect(() => {
        const getCompanyName = () => {  // Get company name by companyID
            var company = companies.find((com) => com.companyID === newApplication.companyID);
            setCompanyName(company?.companyName);
        }

        getCompanyName();
    }, [newApplication.companyID, companies]);

    const getAppliaction = useCallback(async () => {

        var data = await getApplication(id);

        setCompanyId(data.companyID.toString());
        setNewApplication(data);
        //get employee
        var dataEmployees = await getEmployees();
        // // console.log("employees", dataEmployees);

        var employee = dataEmployees.find(employee => employee?.applicationID === id);
        setNewEmployee(employee);
        // var employeeIDs = employees.map(employee => employee.employeeID);

        // setEmployees(employees);
        // //get license
        if (employee) {
            var dataLicenses = await getLicenses();
            var license = dataLicenses.find(license => employee?.employeeID == license.employeeID);
            setNewLicense(license);
        }

    }, [id]);


    useEffect(() => {
        // Fetch the application data from an API or define it statically
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        setUser(user);
        getAppliaction();
    }, [getAppliaction]);



    const [newEmployee, setNewEmployee] = useState({
        avatar: null,
        citizenID: '',
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        licenseType: '',
        testVehicleCode: '',
        companyID: '',
        trainingLevel: '',
        experienceMonths: '',
        personalStatement: '',
        healthCertificate: null,
        railwayType: '',
        personalStatementContent: "",
        healthCertificateContent: ''
    });

    const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleEmployeeFileChange = (e) => {
        const { name, files } = e.target;
        setNewEmployee({ ...newEmployee, [name]: files[0] });
    };
    const handleAddEmployee = (e) => {
        e.preventDefault();
        // Handle the form submission logic here

        // Reset the form
        setNewEmployee({
            avatar: null,
            citizenID: '',
            fullName: '',
            dateOfBirth: '',
            phoneNumber: '',
            licenseType: '',
            testVehicleCode: '',
            companyID: '',
            trainingLevel: '',
            experienceMonths: '',
            personalStatement: '',
            healthCertificate: null
        });
    };

    const [maHS, setMaHS] = useState("GP" + Date.now());

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewApplication({ ...newApplication, [name]: value });
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setNewApplication({ ...newApplication, [name]: files[0] });
    };


    const handleEmployeeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEmployees = [...newApplication.employees];
        updatedEmployees[index][name] = value;
        setNewApplication({ ...newApplication, employees: updatedEmployees });
    };

    // const animals = [   // Example data for Autocomplete
    //     { label: "Công ty than Hồng Thái", value: "1" },
    //     { label: "Công ty NCC plus", value: "2" },
    //     { label: "Công ty than Quảng Ninh", value: "3" },
    //     { label: "Cong ty vận tải Đại Nam", value: "4" },
    //     { label: "Công ty tập đoàn Trí Nam", value: "5" },
    // ];

    // const licenseTypes = [   // Example data for Autocomplete
    //     { label: "Đầu máy diesel", value: "Đầu máy diesel" },
    //     { label: "Đầu máy điện", value: "Đầu máy điện" },
    //     { label: "Đầu máy hơi nước", value: "Đầu máy hơi nước" },
    //     { label: "Phương tiện chuyên dùng đường sắt", value: "Phương tiện chuyên dùng đường sắt" }
    // ];

    // const railwayTypes = [   // Example data for Autocomplete
    //     { label: "Đường săt chuyên dụng", value: "Đường săt chuyên dụng" },
    //     { label: "Đường sắt hỏa", value: "Đường sắt hỏa" },
    //     { label: "Đường sắt đô thị", value: "Đường sắt đô thị" },
    //     { label: "Đường sắt nông thôn", value: "Đường sắt nông thôn" }
    // ];

    // const users = [   // Example data for Autocomplete
    //     { label: "Nguyễn Huy Hoàng", value: "Nguyễn Huy Hoàng" },
    //     { label: "Nguyễn Thị Hà", value: "Nguyễn Thị Hà" },
    //     { label: "Nguyễn Văn A", value: "Nguyễn Văn A" },
    //     { label: "Nguyễn Văn B", value: "Nguyễn Văn B" },
    //     { label: "Nguyễn Văn C", value: "Nguyễn Văn C" },
    // ];

    const addEmployee = () => {
        setNewApplication({
            ...newApplication,
            employees: [...newApplication.employees, { name: '', qualification: '', licenseType: '', vehicle: '', result: '' }]
        });
    };

    useEffect(() => {
        if (newApplication.submitDate) {
            var date = new Date(newApplication.submitDate).toISOString();
            setSubmitDate(parseAbsoluteToLocal(date));
        }
    }, [newApplication]);

    const handleAddApplication = (e) => {
        e.preventDefault();
        // Handle the form submission logic here

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

        });
    };

    const handlePhanCong = () => {
        setIsPhanCong(true);
    }

    const handleGuiThamDinh = async () => {
        var data = {
            ...newApplication,
            status: "Đang xử lý",
            reasonRejection: ""
        }
        var rs = await updateApplication(newApplication.applicationID, data);

        if (rs) {
            getAppliaction();
            onOpenChange(false);
            toast.success("Gửi thẩm định lại thành công");
        } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    }

    const handleXetDuyet = async () => {
        var data = {
            ...newApplication,
            status: "Đã hoàn thành",
            reasonRejection: ""
        }
        var rs = await updateApplication(newApplication.applicationID, data);

        if (rs) {
            getAppliaction();
            onOpenChange(false);
            toast.success("Xét duyệt thành công");
        } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    }

    const handleGuiXetDuyet = async () => {
        var data = {
            ...newApplication,
            status: "Đã xử lý",
            reasonRejection: "",
            examinationPlan: examinationPlan,
            result: result,
            examinationPlanContent: examinationPlanContent,
            resultContent: resultContent
        }
        var rs = await updateApplication(newApplication.applicationID, data);

        //lưu giấy phép
        var license = {
            ...newLicense,
            licenseNumber: maHS,
            employeeID: newEmployee.employeeID,
            issueDate: new Date(newLicense.issueDate).toISOString(),
            expiryDate: new Date(newLicense.expiryDate).toISOString(),
            status: "Hiệu lực"
        }

        var res = await addLicense(license);


        if (rs && res) {
            getAppliaction();
            onOpenChange(false);
            toast.success("Gửi xét thành công");
        } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    }

    const handleLicenseChange = (e) => {
        const { name, value } = e.target;
        setNewLicense({ ...newLicense, [name]: value });
    };
    const renderButton = (status) => {

        if (status === "Chờ xử lý" && user?.roleId === 1) {

            return (
                <>
                    <Button type="submit" onClick={() => router.push(`/dashboard/new/${id}/edit`)} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Chỉnh sửa hồ sơ
                    </Button>
                    {
                        !!newApplication.reasonRejection && <Button onClick={handleGuiThamDinh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"> Gửi yêu cầu thẩm định lại </Button>
                    }
                </>
            )
        }
        if (status === "Chờ xử lý" && user?.roleId === 3 && newApplication.appraiser == 0) {
            return (
                <Button type="submit" onClick={handlePhanCong} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Phân công thẩm định
                </Button>
            )
        }

        if (status === "Đang xử lý" && user?.roleId === 2 && newApplication.appraiser == user?.userId) {

            return (
                <>
                    <Button type="submit" onClick={handleGuiXetDuyet} className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700">
                        Gửi duyệt hồ sơ
                    </Button>
                    <Button type="submit" onClick={() => setIsReason(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Yêu cầu bổ sung hồ sơ
                    </Button>
                </>
            )
        }

        if (status === "Đã xử lý" && user?.roleId === 3) {
            return (
                <>
                <Button type="submit" onClick={setIsReason(true)} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700">
                    Từ chối cấp lại giấy phép
                </Button>
                    <Button type="submit" onClick={handleXetDuyet} className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700">
                        Duyệt hồ sơ và cấp lại giấy phép mới
                    </Button>
                    <Button type="submit" onClick={() => setIsReason(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Yêu cầu thẩm định lại
                    </Button>
                </>
            )
        }

        // if (status === "Đã duyệt" && user?.roleId === 2 && newApplication.appraiser == user?.userId) {

        //     return (
        //         <Button type="submit" onClick={handleDuyet} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
        //             Xác nhận cấp giấy phép mới
        //         </Button>
        //     )
        // }

        if (status === "Đã hoàn thành" && user?.roleId === 1) {

            return (
                <Button type="submit" onClick={() => { }} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
                    In giấy phép
                </Button>
            )
        }

    }
    return (
        <div className="container mx-auto p-4">
            < div className="flex items-center justify-between ">
                <h1 className="text-2xl font-bold mb-4">Chi tiết hồ sơ</h1>
                <div className="flex gap-4 items-center">
                    {/* <Button type="submit" onClick={onOpen} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Xác nhận cấp giấy phép mới
                    </Button> */}
                    {renderButton(newApplication.status)}
                    {/* <Button type="submit" onClick={onOpen} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Yêu cầu thẩm định lại
                    </Button> */}
                    {/* <Button type="submit" onClick={onOpen} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">
                   Từ chối
                </Button> */}
                </div>
            </div>
            {
                !!newApplication.reasonRejection && <div className="flex items-center justify-center w-full">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Lý do từ chối: </strong>
                        <span className="block sm:inline">{newApplication.reasonRejection}
                        </span>
                    </div>

                </div>
            }
            <form onSubmit={handleAddApplication}>
                <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
                    <AccordionItem
                        key="1"
                        title={<b>Thông tin hồ sơ</b>}
                        aria-expanded="true"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Mã hồ sơ</label> */}
                                <Input readonly
                                    label="Mã hồ sơ"
                                    type="text"
                                    name="applicationID"
                                    value={newApplication.applicationID}
                                    // onChange={handleInputChange}
                                    fullWidth
                                    isRequired
                                    isReadOnly
                                />
                            </div>
                            <div className="mb-2">
                                <Autocomplete
                                    label="Chọn doanh nghiệp"
                                    name='companyID'
                                    defaultItems={companies}
                                    defaultSelectedKey={companyId}
                                    selectedKey={companyId}
                                    fullWidth
                                    isRequired
                                    isReadOnly
                                >
                                    {companies.map((com) => (
                                        <AutocompleteItem key={com.companyID} value={com.companyName}>
                                            {com.companyName}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                {/* <Autocomplete
                                  
                                    defaultItems={companies}
                                    defaultSelectedKey={companyId}
                                    selectedKey={companyId}
                                    label="Chọn doanh nghiệp"
                                    fullWidth
                                    variant="bordered"
                                >
                                    {(item) => <AutocompleteItem key={item.companyID}>{item.companyName}</AutocompleteItem>}
                                </Autocomplete> */}
                            </div>
                            <div className="mb-2">

                                <Input readonly
                                    label="Mã số thuế"
                                    type="text"
                                    name="taxCode"
                                    value={newApplication.taxCode}
                                    onChange={handleInputChange}
                                    fullWidth
                                    isRequired
                                    isReadOnly
                                />
                            </div>
                            <div className="mb-2">

                                <Input readonly
                                    label="Người nộp hồ sơ"
                                    type="text"

                                    name="submitterName"
                                    value={newApplication.submitterName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    isReadOnly
                                />
                            </div>
                            <div className="mb-2">

                                {/* <Input  readonly
                                    type="date"
                                    label="Ngày nộp hồ sơ"

                                    name="submitDate"
                                    // value={newApplication.submitDate}
                                    defaultValue={new Date()}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    disabled
                                /> */}
                                <Input readonly
                                    type="text"
                                    label={"Ngày nộp hồ sơ"}
                                    isReadOnly
                                    // defaultValue={new CalendarDate(newApplication.submitDate)}
                                    value={new Date(newApplication?.submitDate).toLocaleDateString()}
                                    placeholderValue={new CalendarDate(1995, 11, 6)}
                                />
                                {/* <DatePicker
                                    hideTimeZone
                                    showMonthAndYearPickers
                                    defaultValue={sunmitDate}
                                    name='submitDate'
                                    value={sunmitDate}
                                    label="Ngày nộp hồ sơ"
                                    variant="bordered"
                                    fullWidth
                                    isReadOnly

                                /> */}
                            </div>

                            <Input readonly
                                label="Trạng thái"
                                type="text"
                                name="status"
                                value={newApplication.status}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                isReadOnly
                            />

                            <div className="mb-2">

                                <Input readonly
                                    type="email"
                                    label="Email"
                                    isReadOnly
                                    name="email"
                                    value={newApplication.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                <Input readonly
                                    type="text"

                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={newApplication.phoneNumber}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    isReadOnly
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                <Input
                                    type="text"

                                    label="Ngày hẹn trả "
                                    name="returnDate"
                                    value={new Date(newApplication?.returnDate).toLocaleDateString()}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>       
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="2"
                        title={<b>Thành phần hồ sơ</b>}
                        aria-expanded="true"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                <Input readonly
                                    label="Đơn đề nghị"
                                    type="text"
                                    name="applicationFile"
                                    onChange={handleFileChange}
                                    value={newApplication.applicationFile}
                                    fullWidth
                                    required
                                    isReadOnly
                                    endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.applicationFileContent, newApplication.applicationFile)} className="cursor-pointer" />}
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Văn bản chứng nhận</label> */}
                                <Input readonly
                                    label="Tài liệu liên quan đến giấy phép cũ"

                                    type="text"
                                    name="certificationDocument"
                                    onChange={handleFileChange}
                                    value={newApplication.certificationDocument}
                                    fullWidth
                                    required
                                    isReadOnly
                                    endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.certificationDocumentContent, newApplication.certificationDocument)} className="cursor-pointer" />}
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <h3 className="text-xl font-bold mb-2">Thông tin người lái tàu</h3>
                            <div className="mb-4 float-start text-center mt-4 mr-4">
                                <Image
                                    isBlurred
                                    width={256}
                                    src={newEmployee?.avatar ? newEmployee.avatar : "/assets/noimage.jpg"}
                                    alt="avatar"

                                />
                                {/* <Input
                                    type="file"
                                    name={'avatar'}
                                    onChange={handleFileChange}
                                    fullWidth
                                    required
                                    className='mt-2 w-64'
                                    isReadOnly
                                /> */}
                                {/* <button className="bg-green-400 mt-5 text-white px-4 py-2 rounded hover:bg-green-700"> <FontAwesomeIcon icon={faUpload} /> Chọn ảnh </button> */}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">

                                <div className="mb-2">

                                    <Input
                                        label="Mã số cá nhân"
                                        type="text"
                                        name="citizenID"
                                        value={newEmployee?.citizenID}
                                        onChange={handleEmployeeInputChange}
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
                                        value={newEmployee?.fullName}
                                        onChange={handleEmployeeInputChange}
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
                                        value={new Date(newEmployee?.dateOfBirth).toLocaleDateString()}
                                        onChange={handleEmployeeInputChange}
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
                                        value={newEmployee?.phoneNumber}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Loại chuyên môn</label> */}

                                    {/* <Autocomplete
                                        label="Loại chuyên môn"
                                        value={newEmployee.licenseType}
                                        defaultSelectedKey={newEmployee.licenseType}
                                        // onInputChange={handleLicenseTypeChange}
                                        name='licenseType'
                                        fullWidth
                                        isRequired
                                        isReadOnly

                                    > */}
                                    {/* {licenseTypes.map((animal) => (
                                            <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                {animal.label}
                                            </AutocompleteItem>
                                        ))} */}
                                    {/* </Autocomplete> */}
                                    <Input
                                        label="Loại chuyên môn"
                                        type="text"
                                        name="licenseType"
                                        value={newEmployee?.licenseType}
                                        // onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Loại tuyến đường sắt</label> */}
                                    {/* <Autocomplete
                                        label="Loại tuyến đường sắt"
                                        value={newEmployee.railwayType}
                                        // onInputChange={handleRailwayTypeChange}

                                        name='railwayType'
                                        fullWidth
                                        isRequired
                                        isReadOnly
                                    > */}
                                    {/* {railwayTypes.map((animal) => (
                                            <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                {animal.label}
                                            </AutocompleteItem>
                                        ))} */}
                                    {/* </Autocomplete> */}

                                    <Input
                                        label="Loại tuyến đường sắt"
                                        type="text"
                                        name="RailwayType"
                                        value={newEmployee?.railwayType}
                                        // onChange={handleEmployeeInputChange}
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
                                        name="companyName"
                                        value={companyName}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />

                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Trình độ</label> */}
                                    <Input
                                        label="Trình độ"
                                        type="text"
                                        name="trainingLevel"
                                        value={newEmployee?.trainingLevel}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Số năm làm phụ tàu</label> */}
                                    <Input
                                        label="Số tháng làm phụ tàu"
                                        type="text"
                                        name="experienceMonths"
                                        value={newEmployee?.experienceMonths}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Phương tiện sát hạch</label> */}
                                    <Input
                                        label="Phương tiện sát hạch"
                                        type="text"
                                        name="testVehicleCode"
                                        value={newEmployee?.testVehicleCode}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Bản khai cá nhân</label> */}
                                    <Input
                                        label="Bản khai cá nhân"
                                        type="text"
                                        name={'personalStatement'}
                                        // onChange={handleEmployeeFileChange}
                                        value={newEmployee?.personalStatement}
                                        fullWidth
                                        required
                                        isReadOnly
                                        endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.personalStatement, newApplication.personalStatementContent)} className="cursor-pointer" />}

                                    />
                                    {/* <UploadFile name="personalStatement" setName={setPersonalStatement} setBase64Content={setPersonalStatementContent} /> */}
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Giây khám sức khỏe</label> */}
                                    <Input
                                        label="Giấy khám sức khỏe"
                                        type="text"
                                        name="healthCertificate"
                                        // onChange={handleEmployeeFileChange}
                                        value={newEmployee?.healthCertificate}
                                        fullWidth
                                        required
                                        isReadOnly
                                        endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.healthCertificateContent, newApplication.healthCertificate)} className="cursor-pointer" />}
                                    />
                                    {/* <UploadFile name="healthCertificate" setName={setHealthCertificate} setBase64Content={setHealthCertificateContent} /> */}
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Giây khám sức khỏe</label> */}
                                    <Input
                                        label="Tình trạng công tác"
                                        type="text"
                                        name="status"
                                        // onChange={handleEmployeeFileChange}
                                        value={newEmployee?.status}
                                        fullWidth
                                        required
                                        isReadOnly
                                    />
                                    {/* <UploadFile name="healthCertificate" setName={setHealthCertificate} setBase64Content={setHealthCertificateContent} /> */}
                                </div>
                            </div>
                            {/* <Button onClick={onOpen} className="bg-green-500 text-white mb-3 px-4 py-2 rounded hover:bg-green-700">
                                Thêm nhân viên
                            </Button> */}

                            {/* <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2">Họ tên</th>
                                        <th className="py-2">Trình độ</th>
                                        <th className="py-2">Loại giấy phép đăng ký</th>
                                        <th className="py-2">Phương tiện</th>
                                        <th className="py-2">Kết quả</th>
                                        <th className="py-2">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{employee.fullName}</td>
                                            <td className="border px-4 py-2">{employee.trainingLevel}</td>
                                            <td className="border px-4 py-2">{employee.licenseType}</td>
                                            <td className="border px-4 py-2">{employee.vehicle}</td>
                                            <td className="border px-4 py-2">{employee.result}</td>
                                            <td className="border px-4 py-2"><button className='text-center'><FontAwesomeIcon icon={faEye} color="blue" width={25} /> </button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}

                        </div>
                    </AccordionItem>
                </Accordion>
                {
                    (newApplication.status === "Đang xử lý" || newApplication.status === "Đã xử lý"  || newApplication.status === "Đã hoàn thành") &&
                    <div>
                        <div className="m-2">

                            <h3 className="text-xl font-bold mb-2">Thông tin sát hạch</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Thông báo sát hạch</label> */}

                                    {

                                        newApplication.status === "Đang xử lý" ?
                                            <>
                                                
                                                <UploadFile title="Thông báo sát hạch (Nếu có)" fileName={newApplication.examinationPlan} name='examinationPlan' setName={setExaminationPlan} setBase64Content={setExaminationPlanContent} />

                                            </> :
                                            <Input
                                                label="Thông báo sát hạch (Nếu có)"
                                                type="text"
                                                name="examinationPlan"
                                                // onChange={handleEmployeeFileChange}
                                                value={newApplication.examinationPlan}
                                                fullWidth
                                                required
                                                isReadOnly
                                                endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.examinationPlanContent, newApplication.examinationPlan)} className="cursor-pointer" />}
                                            />

                                    }

                                    {/*  */}

                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    {/* <label className="block text-gray-700">Thông báo sát hạch</label> */}
                                    {

                                        newApplication.status === "Đang xử lý" ?
                                            <>
                                                <label className="block text-gray-700"></label>
                                                <UploadFile fileName="Kết quả sát hạch (Nếu có)" title="Kết quả sát hạch (Nếu có)" name='result' setName={setResult} setBase64Content={setResultContent} />
                                            </> :
                                            <Input
                                                label="Kết quả sát hạch (Nếu có)"
                                                type="text"
                                                name="result"
                                                // onChange={handleEmployeeFileChange}
                                                value={newApplication.result}
                                                fullWidth
                                                required
                                                isReadOnly
                                                endContent={<FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(newApplication.resultContent, newApplication.result)} className="cursor-pointer" />}
                                            />
                                    }

                                    {/* <UploadFile name='result' setName={setResult} setBase64Content={setResultContent} /> */}

                                </div>
                            </div>
                        </div>
                        <div className="m-2">
                            <h3 className="text-xl font-bold mb-2">Thông tin giấy phép</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    <Input
                                        label="Số giấy phép"
                                        type="text"
                                        name="licenseNumber"
                                        
                                        value={maHS}
                                        fullWidth
                                        isRequired
                                        isReadOnly
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    {
                                        newApplication.status === "Đang xử lý" ? <Input
                                            label="Ngày cấp"
                                            type="date"
                                            name="issueDate"
                                            onChange={handleLicenseChange}
                                            fullWidth
                                            required
                                        /> : <Input readonly
                                            label="Ngày cấp"
                                            type="text"
                                            name="issueDate"
                                            value={new Date(newLicense?.issueDate).toLocaleDateString()}

                                            fullWidth
                                            isReadOnly
                                        />
                                    }

                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    {
                                        newApplication.status === "Đang xử lý" ? <Input
                                            label="Ngày hết hạn"
                                            type="date"
                                            name="expiryDate"
                                            onChange={handleLicenseChange}
                                            fullWidth
                                            required

                                        /> : <Input readonly
                                            label="Ngày hết hạn"
                                            type="text"
                                            name="expiryDate"
                                            value={new Date(newLicense?.issueDate).toLocaleDateString()}
                                            fullWidth
                                            isReadOnly
                                        />
                                    }


                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    <Input readonly
                                        label="Cơ quan cấp"
                                        type="text"
                                        name="issuingAuthority"
                                        onChange={handleLicenseChange}
                                        value={newLicense?.issuingAuthority}
                                        fullWidth
                                        isReadOnly={newApplication.status === "Đã hoàn thành"}
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Đơn đề nghị</label> */}
                                    <Input readonly
                                        label="Người ký"
                                        type="text"
                                        name="signedBy"
                                        onChange={handleLicenseChange}
                                        value={newLicense?.signedBy}
                                        fullWidth
                                        isReadOnly={newApplication.status === "Đã hoàn thành"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }


                {/* <div className="m-2">
                    <h3 className="text-xl font-bold mb-2">Danh sách giấy phép</h3>
                    {user?.roleId === 2 && newApplication.status === "Đã duyệt" && <Button onClick={onOpen} className="bg-green-500 text-white mb-3 px-4 py-2 rounded hover:bg-green-700">
                        Thêm giấy phép
                    </Button>}


                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Số giấy phép</th>
                                <th className="py-2">Họ tên</th>
                                <th className="py-2">Loại giấy phép </th>

                                <th className="py-2">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.map((license, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{license.licenseNumber}</td>
                                    <td className="border px-4 py-2">{license.name}</td>
                                    <td className="border px-4 py-2">{license.licenseType}</td>

                                    <td className="border px-4 py-2"><button className='text-center'><FontAwesomeIcon icon={faEye} color="blue" width={25} /> </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div> */}

            </form>
            <PhanCongModal isOpen={isPhanCong} onOpenChange={setIsPhanCong} application={newApplication} users={users} callBack={getAppliaction} />
            <ReasonModal isOpen={isReason} onOpenChange={setIsReason} application={newApplication} status={newApplication.status} callBack={getAppliaction} />
        </div>
    );
}