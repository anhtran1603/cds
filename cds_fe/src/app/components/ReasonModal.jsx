import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { getUserByRole, updateApplication } from "../../app/helper/api";
import { toast } from 'react-toastify';
export default function ReasonModal(props) {

    const { isOpen, onOpenChange, application, status, callBack } = props;
    const [reason, setReason] = useState(null);

    const handleReasonChange = (value) => {
        console.log("value", value);
        setReason(value);
    }
    console.log("ReasonModal", reason);
    const handleAddReason = async () => {
        // Call the onAdd function with the selected user
        var data = {
            ...application,
            status: status === 'Đang xử lý' ? "Chờ xử lý" : "Đang xử lý",
            reasonRejection: reason
        }
        var rs = await updateApplication(application.applicationID, data);

        if (rs) {
            callBack();
            onOpenChange(false);
            toast.success("Phản hồi thành công");
        }else{
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