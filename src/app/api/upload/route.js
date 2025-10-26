// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase'; // Asegúrate de que la ruta sea correcta

export async function POST(request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images'); // 'images' debe coincidir con el nombre en el FormData del cliente
    
    if (images.length === 0) {
      return NextResponse.json({ error: 'No images provided.' }, { status: 400 });
    }

    const uploadPromises = images.map(async (imageFile) => {
      // Necesitamos el contenido del archivo como un ArrayBuffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Crea una referencia única en Firebase Storage
      const storageRef = ref(storage, `properties/${Date.now()}_${imageFile.name}`);
      
      // Sube el archivo
      await uploadBytes(storageRef, buffer, {
        contentType: imageFile.type, // Es importante incluir el tipo de contenido
      });

      // Obtiene la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Devuelve las URLs de las imágenes subidas
    return NextResponse.json({ imageUrls }, { status: 200 });

  } catch (error) {
    console.error("Error uploading images: ", error);
    return NextResponse.json({ error: 'Failed to upload images.' }, { status: 500 });
  }
}