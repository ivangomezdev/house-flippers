// src/lib/imageUpload.js

const IMGBB_API_KEY = 'e69966f319cd4a033a3a6eb09c8df789';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';


export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Error al subir la imagen a Imgbb');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Error en la subida a Imgbb:', error);
    throw error;
  }
};