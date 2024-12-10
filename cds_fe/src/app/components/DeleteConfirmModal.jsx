
import { useEffect, useState } from "react";
import { getUserByRole, updateApplication } from "../../app/helper/api";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, user } from '@nextui-org/react'
import { toast } from 'react-toastify';

export default function ConfirmDelete(props) {

    const { isOpen, onOpenChange, handleDelete, callBack } = props;
    const handleDeleteAsync = async () => {
        var rs = await handleDelete();
        if (rs) {
            callBack();
            onOpenChange(false);
            toast.success("Xóa bản ghi thành công");
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
                        <ModalHeader className="flex flex-col gap-1">Chọn người thẩm định</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                Dữ liệu sẽ bị xóa. Bạn có chắc chắn muốn xóa bản ghi này không?
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Đóng
                            </Button>
                            <Button color="primary" onPress={handleDeleteAsync}>
                                Xác nhận
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}