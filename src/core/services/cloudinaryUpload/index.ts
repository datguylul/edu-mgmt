import axios from 'axios';

const API_KEY = '454226386488799';
const UPLOAD_PRESET = 'bn3jjpdp';

export const handleCloudinaryUpload = (imgFile: any) => {
  const formData = new FormData();
  // Hình ảnh cần upload
  formData.append('file', imgFile);
  // Tên preset vừa tạo ở bước 1
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('api_key', API_KEY);
  // Tải ảnh lên cloudinary
  // API: https://api.cloudinary.com/v1_1/{Cloudinary-Name}/image/upload

  return new Promise((resolve, reject) => {
    axios
      .post('https://api.cloudinary.com/v1_1/dhi8xksch/image/upload?api_key=454226386488799', formData)
      .then(function ({ data }) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
