'use client'
import { useEffect, useState } from 'react';
import { Input, Accordion, AccordionItem, Autocomplete, AutocompleteItem, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { addApplication, addEmployee, checkDuplicateCitizenID, getApplications, getCompanies } from '../../../helper/api';
import UploadFile from '../../../components/uploadFile';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
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
    const [companyName, setCompanyName] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newEmployee, setNewEmployee] = useState({
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
    const [errors, setErrors] = useState({
        // Application fields
        companyID: '',
        taxCode: '',
        submitterName: '',
        submitDate: '',
        email: '',
        phoneNumber: '',
        duration: '',
        returnDate: '',
        applicationFile: '',
        certificationDocument: '',
        
        // Employee fields
        citizenID: '',
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        licenseType: '',
        railwayType: '',
        companyName: '',
        trainingLevel: '',
        experienceMonths: '',
        testVehicleCode: '',
        personalStatement: '',
        healthCertificate: '',
        status: ''
    });
    const validateForm = async () => {
        const currentApplications = await getApplications();

        let isValid = true;
        const newErrors = {
            companyID: '',
            taxCode: '',
            submitterName: '',
            submitDate: '',
            email: '',
            phoneNumber: '',
            duration: '',
            returnDate: '',
            applicationFile: '',
            certificationDocument: '',

            // Employee fields
            citizenID: '',
            fullName: '',
            dateOfBirth: '',
            phoneNumber: '',
            licenseType: '',
            railwayType: '',
            companyName: '',
            trainingLevel: '',
            experienceMonths: '',
            testVehicleCode: '',
            personalStatement: '',
            healthCertificate: '',
            status: ''
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0[1-9][0-9]{8,9})$/;
        const taxCodeRegex = /^[0-9]{10}(-[0-9]{3})?$/;


        if (!newApplication.companyID) {
            newErrors.companyID = 'Vui lòng chọn doanh nghiệp';
            isValid = false;
        }

        if (!newApplication.submitterName.trim()) {
            newErrors.submitterName = 'Người nộp hồ sơ không được để trống';
            isValid = false;
        }

        if (!newApplication.submitDate) {
            newErrors.submitDate = 'Ngày nộp hồ sơ không được để trống';
            isValid = false;
        }

        if (!newApplication.email.trim()) {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!emailRegex.test(newApplication.email)) {
            newErrors.email = 'Email không đúng định dạng';
            isValid = false;
        } else {
            const emailExists = currentApplications.some(app =>
                app.email.toLowerCase() === newApplication.email.toLowerCase()
            );
            if (emailExists) {
                newErrors.email = 'Email đã tồn tại trong hệ thống';
                isValid = false;
            }
        }
        if (!newApplication.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
            isValid = false;
        } else if (!phoneRegex.test(newApplication.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại không đúng định dạng';
            isValid = false;
        }

        if (!newApplication.taxCode.trim()) {
            newErrors.taxCode = 'Mã số thuế không được để trống';
            isValid = false;
        } else if (!taxCodeRegex.test(newApplication.taxCode)) {
            newErrors.taxCode = 'Mã số thuế không đúng định dạng';
            isValid = false;
        } else {
            const taxCodeExists = currentApplications.some(app =>
                app.taxCode === newApplication.taxCode
            );
            if (taxCodeExists) {
                newErrors.taxCode = 'Mã số thuế đã tồn tại trong hệ thống';
                isValid = false;
            }
        }

        if (!newApplication.duration) {
            newErrors.duration = 'Thời hạn giải quyết không được để trống';
            isValid = false;
        }

        if (!newApplication.returnDate) {
            newErrors.returnDate = 'Ngày hẹn trả không được để trống';
            isValid = false;
        }
  

        if (!applicationFile) {
            newErrors.applicationFile = 'Đơn đề nghị không được để trống';
            isValid = false;
        }

        if (!certificationDocument) {
            newErrors.certificationDocument = 'Văn bản chứng nhận không được để trống';
            isValid = false;
        }


        if (!newEmployee.citizenID.trim()) {
            newErrors.citizenID = 'Mã số cá nhân không được để trống';
            isValid = false;
        } else {
            const citizenIDExists = await checkDuplicateCitizenID(newEmployee.citizenID);
            if (citizenIDExists) {
                newErrors.citizenID = 'Mã số cá nhân đã tồn tại trong hệ thống';
                isValid = false;
            }
        }

        if (!newEmployee.fullName.trim()) {
            newErrors.fullName = 'Họ và tên không được để trống';
            isValid = false;
        }

        if (!newEmployee.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh không được để trống';
            isValid = false;
        }

        if (!newEmployee.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
            isValid = false;
        } else if (!phoneRegex.test(newEmployee.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại không đúng định dạng';
            isValid = false;
        }

        if (!newEmployee.licenseType) {
            newErrors.licenseType = 'Loại chuyên môn không được để trống';
            isValid = false;
        }

        if (!newEmployee.railwayType) {
            newErrors.railwayType = 'Loại tuyến đường sắt không được để trống';
            isValid = false;
        }

        if (!newEmployee.trainingLevel.trim()) {
            newErrors.trainingLevel = 'Trình độ không được để trống';
            isValid = false;
        }
        if (!newEmployee.companyName) {
            newErrors.companyName = 'Đơn vị công tác không được để trống';
            isValid = false;
        }
        if (!newEmployee.experienceMonths) {
            newErrors.experienceMonths = 'Số tháng làm phụ tàu không được để trống';
            isValid = false;
        }

        if (!newEmployee.testVehicleCode.trim()) {
            newErrors.testVehicleCode = 'Phương tiện sát hạch không được để trống';
            isValid = false;
        }

        if (!personalStatement) {
            newErrors.personalStatement = 'Bản khai cá nhân không được để trống';
            isValid = false;
        }

        if (!healthCertificate) {
            newErrors.healthCertificate = 'Giấy khám sức khỏe không được để trống';
            isValid = false;
        }

        if (!newEmployee.status) {
            newErrors.status = 'Tình trạng công tác không được để trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }


    const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setIsDuplicate(false);
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

    const [maHS, setMaHS] = useState("MHS" + Date.now());

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

    const handleCheckDuplicate = async (e) => {
        const { name, value } = e.target;
        if (value.length < 9) {
            setIsDuplicate(false);
            return;
        }
        var rs = await checkDuplicateCitizenID(value);

        console.log(rs);
        setIsDuplicate(rs);

    }

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

        // Reset errors
        setErrors({
            companyID: '',
            taxCode: '',
            submitterName: '',
            submitDate: '',
            email: '',
            phoneNumber: '',
            duration: '',
            returnDate: '',
            applicationFile: '',
            certificationDocument: '',

            // Employee fields
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
            healthCertificate: '',
            healthCertificateContent: '',
            railwayType: '',
            status: 'Đang công tác'
        });

        const isValid = await validateForm();

        if (isValid) {
            setLoading(true);

            try {
                const applicationData = {
                    ...newApplication,
                    applicationID: maHS,
                    applicationType: 'Cấp mới',
                    status: 'Chờ xử lý',
                    submitDate: new Date(newApplication.submitDate),
                    returnDate: new Date(newApplication.returnDate),
                    appraiser: 0,

                    applicationFile: applicationFileContent,
                    certificationDocument: certificationDocumentContent
                };

                const applicationResult = await addApplication(applicationData);

                if (applicationResult) {
                    const employeeData = {
                        ...newEmployee,
                        id: 0,
                        applicationID: maHS,
                        companyID: newApplication.companyID,
                        birthDate: newEmployee.dateOfBirth,

                        avatar: newEmployee.avatar,
                        personalStatement: personalStatementContent,
                        healthCertificate: healthCertificateContent
                    };

                    await addEmployee(employeeData);

                    toast.success('Thêm hồ sơ thành công');

                    router.push('/dashboard/new');

                    // Reset form states
                    setNewApplication({
                        applicationID: '',
                        companyID: '',
                        taxCode: '',
                        submitterName: '',
                        submitDate: '',
                        status: '',
                        email: '',
                        phoneNumber: '',
                        duration: '',
                        returnDate: '',
                        applicationFile: '',
                        certificationDocument: '',
                        certificationDocumentContent: ''
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
                        healthCertificate: '',
                        healthCertificateContent: '',
                        railwayType: '',
                        status: 'Đang công tác'
                    });

                    // Reset file states
                    setApplicationFile('');
                    setApplicationFileContent('');
                    setCertificationDocument('');
                    setCertificationDocumentContent('');
                    setPersonalStatement('');
                    setPersonalStatementContent('');
                    setHealthCertificate('');
                    setHealthCertificateContent('');
                } else {
                    toast.error('Thêm hồ sơ thất bại');
                }
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra. Vui lòng thử lại');
            } finally {
                setLoading(false);
            }
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
    }, [newApplication.companyID, companies]);


    const [base64, setBase64] = useState('');
    // const [downloadLink, setDownloadLink] = useState('');

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
        <>
            {loading ? (<div>...Loading</div>) : (
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
                                            value={maHS}
                                            // onChange={handleInputChange}
                                            fullWidth
                                            isRequired
                                            disabled
                                           
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <Autocomplete
                                            label="Chọn doanh nghiệp"
                                            name='companyID'
                                            fullWidth
                                            isRequired
                                            onInputChange={handleChangeCompany}
                                            value={newApplication.companyID}
                                            isInvalid={!!errors.companyID}
                                            errorMessage={errors.companyID}
                                        >
                                            {companies.map((com) => (
                                                <AutocompleteItem key={com.companyID} value={com.companyID}>
                                                    {com.companyName}
                                                </AutocompleteItem>
                                            ))}
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
                                            isInvalid={!!errors.taxCode}
                                            errorMessage={errors.taxCode}
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
                                            isInvalid={!!errors.submitterName}
                                            errorMessage={errors.submitterName}
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
                                            isInvalid={!!errors.submitDate}
                                            errorMessage={errors.submitDate}
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
                                            isInvalid={!!errors.email}
                                            errorMessage={errors.email}
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
                                            isInvalid={!!errors.phoneNumber}
                                            errorMessage={errors.phoneNumber}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        {/* <label className="block text-gray-700">Số điện thoại</label> */}
                                        <Input
                                            type="number"

                                            label="Thời hạn giải quyết"
                                            name="duration"
                                            value={newApplication.duration}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            isInvalid={!!errors.duration}
                                            errorMessage={errors.duration}
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
                                            isInvalid={!!errors.returnDate}
                                            errorMessage={errors.returnDate}
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
                                        {/*<Input
                         type="file"
                         name="applicationFile"
                         onChange={handleFileChange}
                         fullWidth
                         required
                     /> */}
                                        <UploadFile fileName={newApplication.applicationFile} title="Đơn đề nghị" isRequired={true} name="applicationFile" setName={setApplicationFile} setBase64Content={setApplicationFileContent} />
                                    </div>
                                    <div className="mb-2">
                                        {/* <label className="block text-gray-700">Văn bản chứng nhận</label> */}
                                        {/* <Input
                         type="file"
                         name="certificationDocument"
                         onChange={handleFileChange}
                         fullWidth
                         required
                     /> */}
                                        <UploadFile title="Văn bản chứng nhận" isRequired={true} fileName={newApplication.certificationDocument} name="certificationDocument" setName={setCertificationDocument} setBase64Content={setCertificationDocumentContent} />
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
                                                onBlur={handleCheckDuplicate}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                                isRequired
                                                isInvalid={!!errors.citizenID || isDuplicate}
                                                errorMessage={errors.citizenID || (isDuplicate ? 'Mã số cá nhân đã tồn tại' : '')}
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
                                                isInvalid={!!errors.fullName}
                                                errorMessage={errors.fullName}
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
                                                isInvalid={!!errors.dateOfBirth}
                                                errorMessage={errors.dateOfBirth}
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
                                                isInvalid={!!errors.phoneNumber}
                                                errorMessage={errors.phoneNumber}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            {/* <label className="block text-gray-700">Loại chuyên môn</label> */}

                                            <Autocomplete
                                                label="Loại chuyên môn"
                                                value={newEmployee.licenseType}

                                                onInputChange={handleLicenseTypeChange}
                                                name='licenseType'
                                                fullWidth
                                                isRequired
                                                isInvalid={!!errors.licenseType}
                                                errorMessage={errors.licenseType}
                                            >
                                                {licenseTypes.map((animal) => (
                                                    <AutocompleteItem key={animal.value} value={animal.value} textValue={animal.label}>
                                                        {animal.label}
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
                                                isInvalid={!!errors.railwayType}
                                                errorMessage={errors.railwayType}
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
                                            {/* <label className="block text-gray-700">Đơn vị công tác</label> */}
                                            <Input
                                                label="Đơn vị công tác"
                                                type="text"
                                                name="companyName"
                                                value={companyName}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                                isInvalid={!!errors.companyName}
                                                errorMessage={errors.companyName}
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
                                                isInvalid={!!errors.trainingLevel}
                                                errorMessage={errors.trainingLevel}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            {/* <label className="block text-gray-700">Số năm làm phụ tàu</label> */}
                                            <Input
                                                label="Số tháng làm phụ tàu"
                                                type="number"
                                                name="experienceMonths"
                                                value={newEmployee.experienceMonths}
                                                onChange={handleEmployeeInputChange}
                                                fullWidth
                                                required
                                                isInvalid={!!errors.experienceMonths}
                                                errorMessage={errors.experienceMonths}
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
                                                isInvalid={!!errors.testVehicleCode}
                                                errorMessage={errors.testVehicleCode}
                                            />
                                        </div>
                                        <div className="">
                                            {/* <label className="block text-gray-700">Bản khai cá nhân</label> */}

                                            <UploadFile title="Bản khai cá nhân" fileName={newEmployee.personalStatement} isRequired={true} name="personalStatement" setName={setPersonalStatement} setBase64Content={setPersonalStatementContent} />
                                        </div>
                                        <div className="">

                                            {/* <Input
                                     type="file"
                                     name="healthCertificate"
                                     onChange={handleEmployeeFileChange}
                                     fullWidth
                                     required
                                 /> */}
                                            <UploadFile title="Giấy khám sức khỏe" fileName={newEmployee.healthCertificate} isRequired={true} name="healthCertificate" setName={setHealthCertificate} setBase64Content={setHealthCertificateContent} />
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
                                                isInvalid={!!errors.status}
                                                errorMessage={errors.status}

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


                </div>
            )}
        </>

    );
}