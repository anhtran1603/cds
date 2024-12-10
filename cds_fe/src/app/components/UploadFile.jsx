'use client'
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

export default function UploadForm(props) {

    const {name , setName, setBase64Content, fileName} = props;

    // const [file, setFile] = useState(null);
    const [base64, setBase64] = useState('');
    // const [downloadLink, setDownloadLink] = useState('');

    const handleFileChange = (e) => {
        // setFile(e.target.files[0]);
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

    // const convertBase64ToFile = (base64, filename) => {
    //     const arr = base64.split(',');
    //     const mime = arr[0].match(/:(.*?);/)[1];
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, { type: mime });
    // };

    return (
        <div>
            <form onSubmit={handleUpload}>
                <div className="mb-4">
                
                    <Input
                        size='large'
                        type="file"
                        defaultValue={fileName}
                        name={name}
                        onChange={handleFileChange}
                        fullWidth
                        required
                    />
                </div>
                {/* <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Upload
                </Button> */}
            </form>
            {/* {base64 && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Base64 String</h2>
                    <textarea
                        className="w-full h-64 p-2 border rounded"
                        value={base64}
                        readOnly
                    />
                    <Button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">
                        Download File
                    </Button>
                    {downloadLink && (
                        <a href={downloadLink} download={file.name} className="block mt-2 text-blue-500 hover:underline">
                            Click here to download the file
                        </a>
                    )}
                </div>
            )} */}
        </div>
    );
}