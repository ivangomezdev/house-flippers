// scripts/migrate-images.js

// --- CONFIGURACIÓN ---
const firebaseConfig = {
  apiKey: "AIzaSyBdw_46gBLvoK5I8ue2rRQVxaLtORWHmbM",
  authDomain: "house-flippers-61ff9.firebaseapp.com",
  projectId: "house-flippers-61ff9",
  storageBucket: "house-flippers-61ff9.appspot.com",
  messagingSenderId: "341068944581",
  appId: "1:341068944581:web:07d3a64444910f51e70cac"
};

// --- SCRIPT DE MIGRACIÓN (No necesitas modificar debajo de esta línea) ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Import authentication methods
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';

console.log("🚀 Iniciando script de migración de imágenes...");

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get auth instance
const db = getFirestore(app);
const storage = getStorage(app);

async function migrateImages() {
  // --- PASO 1: Autenticar el script ---
  console.log("🔒 Autenticando el script de forma anónima...");
  try {
    await signInAnonymously(auth);
    console.log("✅ Autenticación anónima exitosa.");
  } catch (error) {
    console.error("❌ Error de autenticación. Revisa las credenciales de Firebase.", error);
    return; // Detener el script si la autenticación falla
  }

  const propertiesCollectionPath = `/artifacts/${firebaseConfig.appId}/public/data/properties`;
  const propertiesCollection = collection(db, propertiesCollectionPath);
  const querySnapshot = await getDocs(propertiesCollection);

  console.log(`✅ Se encontraron ${querySnapshot.docs.length} propiedades para revisar.`);

  for (const document of querySnapshot.docs) {
    const property = document.data();
    const propertyId = document.id;
    let newImageUrls = [];
    let hasChanged = false;

    console.log(`\n🔎 Procesando propiedad: ${property.location || propertyId}`);

    if (!property.imageUrls || !Array.isArray(property.imageUrls)) {
        console.log(`   - ⚠️ No hay un array de imágenes en esta propiedad. Saltando.`);
        continue;
    }

    for (const imageUrl of property.imageUrls) {
      if (imageUrl && (imageUrl.includes('i.ibb.co') || imageUrl.includes('i.bb'))) {
        try {
          console.log(`   - Descargando imagen de: ${imageUrl}`);
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Error al descargar: ${response.statusText}`);
          }
          // Usamos arrayBuffer() y lo convertimos a un Buffer
          const arrayBuffer = await response.arrayBuffer();
          const imageBuffer = Buffer.from(arrayBuffer);

          const imageName = `migrated_${Date.now()}_${imageUrl.split('/').pop()}`;
          const storageRef = ref(storage, `properties/${imageName}`);

          console.log(`   - Subiendo a Firebase Storage como: ${imageName}`);
          await uploadBytes(storageRef, imageBuffer, {
            contentType: response.headers.get('content-type') || 'image/jpeg',
          });
          
          const newUrl = await getDownloadURL(storageRef);
          newImageUrls.push(newUrl);
          console.log(`   - ✅ ¡Éxito! Nueva URL: ${newUrl}`);
          hasChanged = true;

        } catch (error) {
          console.error(`   - ❌ Error migrando ${imageUrl}:`, error.message);
          newImageUrls.push(imageUrl);
        }
      } else {
        newImageUrls.push(imageUrl);
      }
    }

    if (hasChanged) {
      console.log(`   - 🔄 Actualizando documento en Firestore...`);
      const docRef = doc(db, propertiesCollectionPath, propertyId);
      await updateDoc(docRef, { imageUrls: newImageUrls });
      console.log(`   - ✅ Documento actualizado.`);
    } else {
      console.log(`   - No se encontraron imágenes de ImgBB para migrar en esta propiedad.`);
    }
  }

  console.log("\n🎉 ¡Migración completada!");
  process.exit(0); // Termina el script exitosamente
}

migrateImages().catch(error => {
    console.error(error);
    process.exit(1); // Termina el script con un código de error
});