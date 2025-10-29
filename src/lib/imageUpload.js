// src/lib/imageUpload.js

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // La ruta API espera que el campo se llame 'images'
  formData.append('images', imageFile);

  try {
    // Hacemos la petición a nuestra propia API de Next.js
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir la imagen al servidor.');
    }

    const data = await response.json();
    
    // Nuestra API devuelve un array de URLs, tomamos la primera
    if (data.imageUrls && data.imageUrls.length > 0) {
      return data.imageUrls[0];
    } else {
      throw new Error('La API no devolvió una URL de imagen válida.');
    }
    
  } catch (error) {
    console.error('Error en la subida a través de la API local:', error);
    throw error;
  }
};