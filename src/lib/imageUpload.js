// src/lib/imageUpload.js

export const uploadImage = async (imageFile) => {
  // --- INSERTA TU CLAVE DE API DE IMGBB AQUÍ ---
  const apiKey = 'e69966f319cd4a033a3a6eb09c8df789'; 
  
  if (!apiKey || apiKey === 'TU_API_KEY_DE_IMGBB') {
    throw new Error('Por favor, agrega tu clave de API de ImgBB en src/lib/imageUpload.js');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Intentamos dar un mensaje de error más claro de ImgBB
      throw new Error(errorData?.error?.message || 'Error al subir la imagen a ImgBB.');
    }

    const data = await response.json();

    if (data.success && data.data.url) {
      // Devolvemos la URL de la imagen subida
      return data.data.url;
    } else {
      throw new Error('La API de ImgBB no devolvió una URL de imagen válida.');
    }

  } catch (error) {
    console.error('Error en la subida directa a ImgBB:', error);
    throw error;
  }
};