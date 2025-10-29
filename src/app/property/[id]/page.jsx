// src/app/property/[id]/page.jsx
import { db, appId } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import PropertyDetailClient from '../../../components/PropertyDetailClient';

// This function now handles any object with Timestamp fields
const serializeData = (data) => {
  const serialized = { ...data };
  for (const key in serialized) {
    if (serialized[key] instanceof Timestamp) {
<<<<<<< HEAD
      serialized[key] = serialized[key].toDate().toISOString(); // Convert Timestamp to ISO string
=======
      serialized[key] = serialized[key].toDate().toISOString(); // Convertimos a string ISO
    } else if (serialized[key] && typeof serialized[key] === 'object' && !Array.isArray(serialized[key])) {
      // Recursivamente serializar objetos anidados
      serialized[key] = serializeData(serialized[key]);
    } else if (Array.isArray(serialized[key])) {
      // Serializar arrays
      serialized[key] = serialized[key].map(item => 
        typeof item === 'object' && item !== null ? serializeData(item) : item
      );
>>>>>>> 4bbdbc1b802817288d8923cfd1a04c304dc06d82
    }
  }
  return serialized;
};

// This function runs on the server
async function getPropertyData(id) {
  try {
    const docPath = `/artifacts/${appId}/public/data/properties/${id}`;
    const propertyDocRef = doc(db, docPath);
    const docSnap = await getDoc(propertyDocRef);

    if (!docSnap.exists()) {
      return null;
    }

<<<<<<< HEAD
    // --- FIX IS HERE ---
    // We now serialize the main property data to convert its Timestamp
=======
    // Serializar propertyData
>>>>>>> 4bbdbc1b802817288d8923cfd1a04c304dc06d82
    const propertyData = serializeData({ id: docSnap.id, ...docSnap.data() });

    // Fetch expenses
    const expensesColPath = `${docPath}/expenses`;
    const expensesSnapshot = await getDocs(collection(db, expensesColPath));
    const expensesList = expensesSnapshot.docs.map(doc => {
      return serializeData({ id: doc.id, ...doc.data() }); // Re-using the improved function
    });
    // Sorting can now be done reliably with ISO strings
    expensesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    // Fetch refaction images
    const refactionImagesColRef = collection(db, `${docPath}/refaccionImages`);
    const refactionSnapshot = await getDocs(refactionImagesColRef);
<<<<<<< HEAD
    const refactionsList = refactionSnapshot.docs.map(doc => serializeData({ id: doc.id, ...doc.data() }));
=======
    const refactionsList = refactionSnapshot.docs.map(doc => 
      serializeData({ id: doc.id, ...doc.data() })
    );
>>>>>>> 4bbdbc1b802817288d8923cfd1a04c304dc06d82

    return {
      property: propertyData,
      expenses: expensesList,
      refactionImages: refactionsList
    };
  } catch (error) {
    console.error("Error fetching data on server:", error);
    return null;
  }
}

// The page component remains a Server Component
export default async function PropertyDetailPage({ params }) {
  const { id } = await params;

  const data = await getPropertyData(id);

  if (!data) {
    return (
      <div className="property-detail-container">
        <h1 className="loading-text">Propiedad no encontrada.</h1>
      </div>
    );
  }

  // We now pass fully serialized, plain objects to the Client Component
  return (
    <PropertyDetailClient 
      property={data.property} 
      expenses={data.expenses} 
      refactionImages={data.refactionImages}
    />
  );
}