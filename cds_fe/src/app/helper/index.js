import { getCompany } from '../helper/api';
export function convertBase64ToFile(base64, filename) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export const handleDownload = (base64, fileName) => {
        if (base64) {
            const file = convertBase64ToFile(base64, fileName);
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.log('No base64 string available');
        }
    };
   export const getCompanyName = async (id) => {
        try {
            if (!id) return;
            const data = await getCompany(id);
            return data.companyName;
        } catch (error) {
            console.error("error", error);
        }
    }
