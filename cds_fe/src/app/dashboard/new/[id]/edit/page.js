'use client'
import { useEffect, useState, useCallback } from 'react';
import { Input, Accordion, AccordionItem, Autocomplete, AutocompleteItem, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { updateApplication, getApplication, updateEmployee, getEmployees, getCompanies } from '../../../../helper/api';
import UploadFile from '../../../../components/uploadFile';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '../../../../helper';

export default function Page() {
    const { id } = useParams(); // Lấy ID từ URL
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [companyId, setCompanyId] = useState('');
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
        duration: "",
        appraiser: '',
        appraiserName: '',
        reasonRejection: ''
    });
    const [applicationFile, setApplicationFile] = useState(null);
    const [certificationDocument, setCertificationDocument] = useState(null);
    const [applicationFileContent, setApplicationFileContent] = useState(null);
    const [certificationDocumentContent, setCertificationDocumentContent] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [healthCertificate, setHealthCertificate] = useState(null);
    const [personalStatement, setPersonalStatement] = useState(null);
    const [healthCertificateContent, setHealthCertificateContent] = useState(null);
    const [personalStatementContent, setPersonalStatementContent] = useState(null);
    const [licenseType, setLicenseType] = useState('');
    const [companyName, setCompanyName] = useState('');

    const [newEmployee, setNewEmployee] = useState({
        id: '',
        avatar: '',
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
        personalStatementContent: '',
        healthCertificate: "",
        healthCertificateContent: "",
        railwayType: '',
        status: 'Đang công tác'
    });




    const getData = useCallback(async () => {

        var data = await getApplication(id);
        const submitDate = formatDate(data.submitDate);
        const returnDate = formatDate(data.returnDate);
        setNewApplication({ ...data, submitDate, returnDate });

        setCompanyId(data.companyID.toString());

        //get employee
        var dataEmployees = await getEmployees();
        // // console.log("employees", dataEmployees);

        var employee = dataEmployees.find(employee => employee?.applicationID === id);

        const dateOfBirth = formatDate(employee?.dateOfBirth);
        setLicenseType(employee?.licenseType);
        setNewEmployee({ ...employee, dateOfBirth });

    }, [id, getEmployees, getApplication]);


    useEffect(() => {
        getData();

    }, [getData]);

    console.log("newEmployee", companyId);
    const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;

        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleEmployeeFileChange = (e) => {
        const { name, files } = e.target;
        setNewEmployee({ ...newEmployee, [name]: files[0] });
    };

    useEffect(() => {
        setNewApplication({
            ...newApplication,
            applicationFile: applicationFile,
            certificationDocument: certificationDocument,
            applicationFileContent: applicationFileContent,
            certificationDocumentContent: certificationDocumentContent
        });
    }, [applicationFileContent, applicationFile, certificationDocumentContent, certificationDocument]);


    useEffect(() => {
        setNewEmployee({
            ...newEmployee,
            personalStatement: personalStatement,
            healthCertificate: healthCertificate,
            personalStatementContent: personalStatementContent,
            healthCertificateContent: healthCertificateContent
        });

    }, [personalStatement, healthCertificate, personalStatementContent, healthCertificateContent]);

    const handleAddEmployee = (e) => {
        // e.preventDefault();
        // Handle the form submission logic here

        setEmployees([...employees, newEmployee]);
        // Reset the form
        setNewEmployee({
            id: '',
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
            personalStatementContent: '',
            healthCertificate: "",
            healthCertificateContent: "",
            railwayType: ''
        });
        onOpenChange();
    };

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


    useEffect(() => {

        var getData = async () => {
            const data = await getCompanies();
            setCompanies(data);
        }

        getData()

    }, [getCompanies]);

    const employeeStatus = [
        { label: "Đang công tác", value: "Đang công tác" },
        { label: "Đã nghỉ việc", value: "Đã nghỉ việc" }
    ];


    const licenseTypes = [   // Example data for Autocomplete
        { label: "Đầu máy diesel", value: "Đầu máy diesel" },
        { label: "Đầu máy điện", value: "Đầu máy điện" },
        { label: "Đầu máy hơi nước", value: "Đầu máy hơi nước" },
        { label: "Phương tiện chuyên dùng đường sắt", value: "Phương tiện chuyên dùng đường sắt" }
    ];

    const railwayTypes = [   // Example data for Autocomplete
        { label: "Đường săt chuyên dụng", value: "Đường săt chuyên dụng" },
        { label: "Đường sắt hỏa", value: "Đường sắt hỏa" },
        { label: "Đường sắt đô thị", value: "Đường sắt đô thị" },
        { label: "Đường sắt nông thôn", value: "Đường sắt nông thôn" }
    ];

    const handleAddApplication = async (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        try {
            var data = {
                ...newApplication,
                applicationType: 'Cấp mới',
                status: 'Chờ xử lý',
                submitDate: new Date(newApplication.submitDate),
                returnDate: new Date(newApplication.returnDate),
                appraiser: 0,
            }

            var rs = await updateApplication(id, data);
            if (rs) {

                if (newEmployee) {   // Add employees to the application
                    // employees.forEach(async (employee) => {
                    var employeeData = {
                        ...newEmployee,
                        applicationID: id,
                        companyID: newApplication.companyID,
                        birthDate: newEmployee.dateOfBirth,
                    }
                    await updateEmployee(employeeData);
                    // });
                }

                toast.success('Thêm hồ sơ thành công');
                router.push('/dashboard/new');
                // Reset the form
                setNewApplication({
                    applicationID: '',
                    companyID: '',
                    taxCode: '',
                    submitterName: '',
                    submitDate: '',
                    status: '',
                    email: '',
                    phoneNumber: '',
                    requestForm: '',
                    certificationDocument: '',
                    certificationDocumentContent: '',

                });
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
                    personalStatementContent: '',
                    healthCertificate: "",
                    healthCertificateContent: "",
                    railwayType: '',
                    status: 'Đang công tác'
                });
            } else {
                toast.error('Thêm hồ sơ thất bại');
            }

        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại');
        }


    };


    const handleChangeCompany = (value) => {

        var company = companies.find((com) => com.companyName === value);

        setNewApplication({ ...newApplication, companyID: company?.companyID, taxCode: company?.taxCode, email: company?.email, phoneNumber: company?.phoneNumber });

    }

    const handleLicenseTypeChange = (value) => {

        setNewEmployee({ ...newEmployee, licenseType: value });
    }
    const handleRailwayTypeChange = (value) => {

        setNewEmployee({ ...newEmployee, railwayType: value });
    }

    useEffect(() => {
        const getCompanyName = () => {  // Get company name by companyID
            var company = companies.find((com) => com.companyID === newApplication.companyID);
            setCompanyName(company?.companyName);
        }

        getCompanyName();
    }, [newApplication, companies]);

    const handleFileChange = (e) => {
        // setFile(e.target.files[0]);
        handleUpload(e.target.files[0])
    };

    const handleUpload = async (file) => {
        if (file) {
            const base64String = await convertToBase64(file);
            setNewEmployee({ ...newEmployee, avatar: base64String });
        } else {
            console.log('Please select a file');
        }
    };

    // const handleDownload = () => {
    //     if (base64) {
    //         const file = convertBase64ToFile(base64, file.name);
    //         const url = URL.createObjectURL(file);
    //         setDownloadLink(url);
    //     } else {
    //         console.log('No base64 string available');
    //     }
    // };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    return (
        <div className="container mx-auto p-4">
            < div className="flex items-center justify-between ">
                <h1 className="text-2xl font-bold mb-4">Thêm mới hồ sơ</h1>
                <Button onClick={handleAddApplication} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Lưu hồ sơ
                </Button>
            </div>

            <div >

                <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
                    <AccordionItem
                        key="1"
                        title={<b>Thông tin hồ sơ</b>}
                        aria-expanded="true"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Mã hồ sơ</label> */}
                                <Input
                                    label="Mã hồ sơ"
                                    type="text"
                                    name="applicationID"
                                    value={newApplication.applicationID}
                                    // onChange={handleInputChange}
                                    fullWidth
                                    isRequired
                                    disabled
                                />
                            </div>
                            <div className="mb-2">
                                {/* <Autocomplete
                                    label="Chọn doanh nghiệp"
                                    name='companyID'
                                    fullWidth
                                    isRequired
                                    defaultSelectedKey={companyName}
                                    onInputChange={handleChangeCompany}
                                    value={newApplication.companyID}
                                >
                                    {companies.map((com) => (
                                        <AutocompleteItem key={com.companyID} value={com.companyID}>
                                            {com.companyName}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete> */}
                                <Autocomplete
                                    label="Chọn doanh nghiệp"

                                    name='companyID'
                                    defaultItems={companies}
                                    // defaultInputValue={"Công ty hồng thái"}
                                    onInputChange={handleChangeCompany}
                                    defaultSelectedKey={companyId+ ""}

                                >
                                    {(item) => <AutocompleteItem key={item.companyID} value={item.value} textValue={item.companyName}>{item.companyName}</AutocompleteItem>}
                                </Autocomplete>
                            </div>
                            <div className="mb-2">

                                <Input
                                    label="Mã số thuế"
                                    type="text"
                                    name="taxCode"
                                    value={newApplication.taxCode}
                                    onChange={handleInputChange}
                                    fullWidth
                                    isRequired
                                />
                            </div>
                            <div className="mb-2">

                                <Input
                                    label="Người nộp hồ sơ"
                                    type="text"

                                    name="submitterName"
                                    value={newApplication.submitterName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">

                                <Input
                                    type="date"
                                    label="Ngày nộp hồ sơ"

                                    name="submitDate"

                                    value={newApplication.submitDate}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>

                            <Input
                                type="hidden"
                                name="status"
                                value={newApplication.status}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />

                            <div className="mb-2">

                                <Input
                                    type="email"
                                    label="Email"

                                    name="email"
                                    value={newApplication.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                <Input
                                    type="text"

                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={newApplication.phoneNumber}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                <Input
                                    type="text"

                                    label="Thời hạn giải quyết"
                                    name="duration"
                                    value={newApplication.duration}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                <Input
                                    type="date"

                                    label="Ngày hẹn trả "
                                    name="returnDate"
                                    value={newApplication.returnDate}
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
                                <label className="block text-gray-700">Đơn đề nghị</label>
                                {/*<Input
                                    type="file"
                                    name="applicationFile"
                                    onChange={handleFileChange}
                                    fullWidth
                                    required
                                /> */}
                                <UploadFile name="applicationFile" fileName={newApplication.applicationFile} setName={setApplicationFile} setBase64Content={setApplicationFileContent} />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Văn bản chứng nhận</label>
                                {/* <Input
                                    type="file"
                                    name="certificationDocument"
                                    onChange={handleFileChange}
                                    fullWidth
                                    required
                                /> */}
                                <UploadFile name="certificationDocument" setName={setCertificationDocument} setBase64Content={setCertificationDocumentContent} />
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold mb-2">Thông tin người lái tàu</h2>
                            <div className="mb-4 float-start text-center mt-4 mr-4">
                                <Image
                                    isBlurred
                                    width={256}
                                    src={newEmployee.avatar ? newEmployee.avatar : "/assets/noimage.jpg"}
                                    alt="avatar"

                                />
                                <Input
                                    type="file"
                                    name={'avatar'}
                                    onChange={handleFileChange}
                                    fullWidth
                                    required
                                    className='mt-2 w-64'

                                />
                                {/* <button className="bg-green-400 mt-5 text-white px-4 py-2 rounded hover:bg-green-700"> <FontAwesomeIcon icon={faUpload} /> Chọn ảnh </button> */}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">

                                <div className="mb-2">

                                    <Input
                                        label="Mã số cá nhân"
                                        type="text"
                                        name="citizenID"
                                        value={newEmployee.citizenID}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Họ và tên</label> */}
                                    <Input
                                        label="Họ và tên"
                                        type="text"
                                        name="fullName"
                                        value={newEmployee.fullName}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Ngày sinhh</label> */}
                                    <Input
                                        label="Ngày sinh"
                                        type="date"
                                        name="dateOfBirth"
                                        value={newEmployee.dateOfBirth}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                    <Input
                                        label="Số điện thoại"
                                        type="text"
                                        name="phoneNumber"
                                        value={newEmployee.phoneNumber}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Loại chuyên môn</label> */}

                                    <Autocomplete
                                        label="Loại chuyên môn"
                                        value={licenseType}
                                        defaultInputValue={licenseType}
                                        onInputChange={handleLicenseTypeChange}
                                        name='licenseType'
                                        fullWidth
                                        isRequired
                                    >
                                        {licenseTypes.map((type) => (
                                            <AutocompleteItem key={type.value} value={type.value} >
                                                {type.label}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Loại tuyến đường sắt</label> */}
                                    <Autocomplete
                                        label="Loại tuyến đường sắt"
                                        value={newEmployee.railwayType}
                                        onInputChange={handleRailwayTypeChange}

                                        name='railwayType'
                                        fullWidth
                                        isRequired
                                    >
                                        {railwayTypes.map((animal) => (
                                            <AutocompleteItem key={animal.value} value={animal.value} >
                                                {animal.label}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>

                                    {/* <Input
                                                type="text"
                                                name="RailwayType"
                                                // value={newEmployee.testVehicleCode}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            /> */}
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
                                    />

                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Trình độ</label> */}
                                    <Input
                                        label="Trình độ"
                                        type="text"
                                        name="trainingLevel"
                                        value={newEmployee.trainingLevel}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Số năm làm phụ tàu</label> */}
                                    <Input
                                        label="Số tháng làm phụ tàu"
                                        type="text"
                                        name="experienceMonths"
                                        value={newEmployee.experienceMonths}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Phương tiện sát hạch</label> */}
                                    <Input
                                        label="Phương tiện sát hạch"
                                        type="text"
                                        name="testVehicleCode"
                                        value={newEmployee.testVehicleCode}
                                        onChange={handleEmployeeInputChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-gray-700">Bản khai cá nhân</label>
                                    {/* <Input

                                                type="file"
                                                name={'personalStatement'}
                                                onChange={handleEmployeeFileChange}
                                                fullWidth
                                                required
                                            /> */}
                                    <UploadFile name="personalStatement" setName={setPersonalStatement} setBase64Content={setPersonalStatementContent} />
                                </div>
                                <div className="">
                                    <label className="block text-gray-700">Giây khám sức khỏe</label>
                                    {/* <Input
                                                type="file"
                                                name="healthCertificate"
                                                onChange={handleEmployeeFileChange}
                                                fullWidth
                                                required
                                            /> */}
                                    <UploadFile name="healthCertificate" setName={setHealthCertificate} setBase64Content={setHealthCertificateContent} />
                                </div>
                                <div className="mb-2">
                                    {/* <label className="block text-gray-700">Loại tuyến đường sắt</label> */}
                                    <Autocomplete
                                        label="Tình trạng công tác"
                                        value={newEmployee.status}
                                        onInputChange={handleRailwayTypeChange}
                                        defaultSelectedKey={"Đang công tác"}
                                        name='status'
                                        fullWidth

                                    >
                                        {employeeStatus.map((animal) => (
                                            <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                {animal.label}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
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
            </div>

            <Modal
                backdrop="opaque"
                size='5xl'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Thêm mới nhân viên</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleAddEmployee}>
                                    <div className="mb-2 float-start text-center mr-5">
                                        <Image
                                            isBlurred
                                            width={250}
                                            src={newEmployee.avatar ? newEmployee.avatar : "/assets/noimage.jpg"}
                                            alt="avatar"

                                        />
                                        <Input
                                            type="file"
                                            name={'avatar'}
                                            onChange={handleFileChange}
                                            fullWidth
                                            required
                                            className='mt-2'
                                        />
                                        {/* <button className="bg-green-400 mt-5 text-white px-4 py-2 rounded hover:bg-green-700"> <FontAwesomeIcon icon={faUpload} /> Chọn ảnh </button> */}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">

                                        <div className="mb-2">
                                            <label className="block text-gray-700">Mã số cá nhân</label>
                                            <Input
                                                type="text"
                                                name="citizenID"
                                                value={newEmployee.citizenID}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Họ và tên</label>
                                            <Input
                                                type="text"
                                                name="fullName"
                                                value={newEmployee.fullName}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Ngày sinhh</label>
                                            <Input
                                                type="date"
                                                name="dateOfBirth"
                                                value={newEmployee.dateOfBirth}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Số điện thoại</label>
                                            <Input
                                                type="text"
                                                name="phoneNumber"
                                                value={newEmployee.phoneNumber}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Loại chuyên môn</label>

                                            <Autocomplete
                                                label="Loại chuyên môn"
                                                value={newEmployee.licenseType}

                                                onInputChange={handleLicenseTypeChange}
                                                name='licenseType'
                                                fullWidth
                                                isRequired

                                            >
                                                {licenseTypes.map((animal) => (
                                                    <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                        {animal.label}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Loại tuyến đường sắt</label>
                                            <Autocomplete
                                                label="Loại tuyến đường sắt"
                                                value={newEmployee.railwayType}
                                                onInputChange={handleRailwayTypeChange}

                                                name='railwayType'
                                                fullWidth
                                                isRequired
                                            >
                                                {railwayTypes.map((animal) => (
                                                    <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                        {animal.label}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>

                                            {/* <Input
                                                type="text"
                                                name="RailwayType"
                                                // value={newEmployee.testVehicleCode}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            /> */}
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Đơn vị công tác</label>
                                            <Input
                                                type="text"
                                                name="companyName"
                                                value={companyName}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />

                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Trình độ</label>
                                            <Input
                                                type="text"
                                                name="trainingLevel"
                                                value={newEmployee.trainingLevel}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Số năm làm phụ tàu</label>
                                            <Input
                                                type="text"
                                                name="experienceMonths"
                                                value={newEmployee.experienceMonths}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Phương tiện sát hạch</label>
                                            <Input
                                                type="text"
                                                name="testVehicleCode"
                                                value={newEmployee.testVehicleCode}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Bản khai cá nhân</label>
                                            {/* <Input

                                                type="file"
                                                name={'personalStatement'}
                                                onChange={handleEmployeeFileChange}
                                                fullWidth
                                                required
                                            /> */}
                                            <UploadFile name="personalStatement" setName={setPersonalStatement} setBase64Content={setPersonalStatementContent} />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700">Giây khám sức khỏe</label>
                                            {/* <Input
                                                type="file"
                                                name="healthCertificate"
                                                onChange={handleEmployeeFileChange}
                                                fullWidth
                                                required
                                            /> */}
                                            <UploadFile name="healthCertificate" setName={setHealthCertificate} setBase64Content={setHealthCertificateContent} />
                                        </div>
                                    </div>

                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handleAddEmployee}>
                                    Lưu lại
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}