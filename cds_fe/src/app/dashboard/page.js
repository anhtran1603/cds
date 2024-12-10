'use client'
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faRedo, faHourglassHalf, faSpinner, faCheckCircle, faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { getApplications } from '../helper/api';
export default function Page() {
  

    const [newApplications, setNewApplications] = useState(0);
    const [renewedApplications, setRenewedApplications] = useState(0);
    const [pendingApplications, setPendingApplications] = useState(0);
    const [processingApplications, setProcessingApplications] = useState(0);
    const [completedApplications, setCompletedApplications] = useState(0);
    const [returnedApplications, setReturnedApplications] = useState(0);



    useEffect(() => {
        const getData = async () => {
            const data = await getApplications();
            setNewApplications(data.filter((app) => app.applicationType === "Cấp mới").length);
            setRenewedApplications(data.filter((app) => app.applicationType === "Cấp lại").length);
            setPendingApplications(data.filter((app) => app.status === "Chờ xử lý").length);
            setProcessingApplications(data.filter((app) => app.status === "Đang xử lý").length);
            setCompletedApplications(data.filter((app) => app.status === "Đã hoàn thành").length);
            setReturnedApplications(data.filter((app) => !!app.reasonRejection ).length);
        }
        getData();
    }, []);

    return (
        <div>
          
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                    <div className="p-4 bg-blue-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="text-blue-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-blue-700 text-xl font-bold">Tổng hồ sơ cấp mới</div>
                            <div className="text-3xl font-bold text-blue-700">{newApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-4 bg-green-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faRedo} className="text-green-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-green-700 text-xl font-bold">Tổng hồ sơ cấp lại</div>
                            <div className="text-3xl font-bold text-green-700">{renewedApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-4 bg-yellow-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-yellow-700 text-xl font-bold">Số hồ sơ chờ xử lý</div>
                            <div className="text-3xl font-bold text-yellow-700">{pendingApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-4 bg-orange-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faSpinner} className="text-orange-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-orange-700 text-xl font-bold">Số hồ sơ đang xử lý</div>
                            <div className="text-3xl font-bold text-orange-700">{processingApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-4 bg-purple-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-purple-700 text-xl font-bold">Số hồ sơ đã hoàn thành</div>
                            <div className="text-3xl font-bold text-purple-700">{completedApplications}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-4 bg-cyan-100 shadow rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faHandPointLeft} className="text-cyan-700 mr-5 text-3xl" />
                        <div>
                            <div className="text-cyan-700 text-xl font-bold">Số hồ sơ bị trả lại</div>
                            <div className="text-3xl font-bold text-cyan-700">{returnedApplications}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}