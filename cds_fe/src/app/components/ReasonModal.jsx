import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { updateApplication } from "../../app/helper/api";
import { toast } from 'react-toastify';
export default function ReasonModal(props) {

    const { isOpen, onOpenChange, application, status, callBack } = props;
    const [reason, setReason] = useState(null);

    const handleReasonChange = (value) => {
        setReason(value);
    }
    console.log("application", status);
    const handleAddReason = async () => {
        // Call the onAdd function with the selected user
        if (!reason) {
            toast.error("Vui lòng nhập lý do");
            return;
        }
        var  statusUpdated = "";
        if(application.applicationType == "Cấp lại"){
            if(status == "Đã duyệt"){
                statusUpdated = "Duyệt từ chối";
            }
            if(status == "Đang xử lý"){
                if(!application.examinationPlan){
                    statusUpdated = "Chờ xử lý";
                }else{
                    statusUpdated = "Duyệt từ chối";
                }
               
            }
            if(status == "Đã xử lý"){
                statusUpdated = "Đang xử lý";
            }
        }else{
            if(status == "Đã duyệt"){
                statusUpdated = "Đã từ chối";
            }
            if(status == "Đang xử lý"){
                statusUpdated = "Chờ xử lý";
            }
            if(status == "Đã xử lý"){
                statusUpdated = "Đang xử lý";
            }
        }

        var data = {
            ...application,
            status: statusUpdated,
            reasonRejection: reason
        }
        var rs = await updateApplication(application.applicationID, data);

        if (rs) {
            callBack();
            onOpenChange(false);
            toast.success("Phản hồi thành công");
        } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    }
    return (
        <Modal
            backdrop="opaque"
            size='lg'
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Lý do phản hồi</ModalHeader>
                        <ModalBody>

                            <div className="grid grid-cols-1 gap-4 mb-4">

                                <div className="mb-2">
                                    <label className="block text-gray-700">Nhập lý do</label>
                                    <Textarea
                                        errorMessage="Vui lòng nhập lý do"
                                        isInvalid={!reason}
                                        name="citizenID"
                                        value={reason}
                                        onValueChange={handleReasonChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                            </div>


                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Đóng
                            </Button>
                            <Button color="primary" onPress={handleAddReason}>
                                Xác nhận
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}