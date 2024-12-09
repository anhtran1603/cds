import { useEffect, useState } from "react";
import { getUserByRole, updateApplication } from "../../app/helper/api";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, user } from '@nextui-org/react'
import { toast } from 'react-toastify';

export default function PhanCongModal (props) {

    console.log("PhanCongModal", props);
    const { isOpen, onOpenChange, users, application , callBack} = props;

    const [selectedUser, setSelectedUser] = useState(null);
    const [userName, setUserName] = useState(null);

    

    const handleUserChange = (value) => {
        var user = users.find(u => u.fullName === value);
        console.log("user", user);
        setSelectedUser(user);
        // setUserName(value);
    }

    const handleAddAssignee = async() => {
        // Call the onAdd function with the selected user
        var data =  {
            ...application,
            appraiser: selectedUser.userID,
            appraiserName: selectedUser.fullName,
            status: "Đang xử lý"
        }
        var rs =  await updateApplication(application.applicationID, data);

        if(rs){
            callBack();
            onOpenChange(false);
            toast.success("Phân công chuyên viên thẩm định thành công");
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
                        <ModalHeader className="flex flex-col gap-1">Chọn người thẩm định</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div className="mb-2">
                                    <label className="block text-gray-700">Người thẩm định</label>

                                    <Autocomplete
                                        value={selectedUser}
                                        onInputChange={handleUserChange}
                                        name='user'
                                        fullWidth
                                        isRequired
                                    >
                                        {users.map((u) => (
                                            <AutocompleteItem key={u.id} value={u.id}>
                                                {u.fullName}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Đóng
                            </Button>
                            <Button color="primary" onPress={handleAddAssignee}>
                                Xác nhận
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
