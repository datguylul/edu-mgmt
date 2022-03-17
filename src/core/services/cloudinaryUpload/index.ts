import axios from 'axios';

const API_KEY = '454226386488799';
const UPLOAD_PRESET = 'bn3jjpdp';

export const handleCloudinaryUpload = (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('api_key', API_KEY);

  // API: https://api.cloudinary.com/v1_1/{Cloudinary-Name}/image/upload

  return new Promise((resolve, reject) => {
    axios
      .post('https://api.cloudinary.com/v1_1/dhi8xksch/raw/upload?api_key=454226386488799', formData)
      .then(function ({ data }) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
