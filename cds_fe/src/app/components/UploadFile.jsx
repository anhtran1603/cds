'use client'
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function UploadFile(props) {

    const { name, setName, setBase64Content, fileName, title, isRequired } = props;
    const [base64, setBase64] = useState('');

    const handleFileChange = (e) => {
        handleUpload(e.target.files[0])
    };

    const handleUpload = async (file) => {
        if (file) {
            const base64String = await convertToBase64(file);
            setName(file.name);
            setBase64(base64String);
            setBase64Content(base64String);
        } else {
            console.log('Please select a file');
        }
    };
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    console.log(fileName);
    return (
        <div>
            <form onSubmit={handleUpload}>
                <div className="flex justify-between mb-4">
                    <Input
                        type="text"
                        label={title}
                        value={fileName}
                        isReadOnly
                        fullWidth
                        isRequired = {isRequired}
                        isInvalid = {isRequired && !fileName}
                        errorMessage = { isRequired && !fileName ? title + " không được để trống" : ''}
                    />
                    <div className={ isRequired && !fileName ?"flex flex-col items-center justify-center mb-5" :"flex flex-col items-center justify-center"}>
                                <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center -mt-0 rounded-lg h-14 p-4">
                                        <FontAwesomeIcon icon={faUpload} className="text-black-400" />
                                    </div>
                                    <input
                                        type="file"
                                        name={name}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                </div>

            </form>
        </div>
    );
}