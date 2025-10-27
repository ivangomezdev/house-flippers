// src/app/property/[id]/page.jsx
import { db, appId } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import PropertyDetailClient from '../../../components/PropertyDetailClient';

// Función para convertir datos no serializables (como Timestamps)
const serializeData = (data) => {
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString(); // Convertimos a string ISO
    }
  }
  return data;
};

// Esta es la función que se ejecuta en el servidor
async function getPropertyData(id) {
  try {
    const docPath = `/artifacts/${appId}/public/data/properties/${id}`;
    const propertyDocRef = doc(db, docPath);
    const docSnap = await getDoc(propertyDocRef);

    if (!docSnap.exists()) {
      return null;
    }

    const propertyData = { id: docSnap.id, ...docSnap.data() };

    // Fetch expenses
    const expensesColPath = `${docPath}/expenses`;
    const expensesSnapshot = await getDocs(collection(db, expensesColPath));
    const expensesList = expensesSnapshot.docs.map(doc => {
      const data = doc.data();
      return serializeData({ id: doc.id, ...data });
    });
    expensesList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Fetch refaction images
    const refactionImagesColRef = collection(db, `${docPath}/refaccionImages`);
    const refactionSnapshot = await getDocs(refactionImagesColRef);
    const refactionsList = refactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

// El componente de página ahora es un Server Component
export default async function PropertyDetailPage({ params }) {
  // Await params to resolve the Promise
  const { id } = await params;

  const data = await getPropertyData(id);

  if (!data) {
    return (
      <div className="property-detail-container">
        <h1 className="loading-text">Prop deficiencia Propiedad no encontrada.</h1>
      </div>
    );
  }

  // Renderizamos el componente de cliente y le pasamos los datos como props
  return (
    <PropertyDetailClient 
      property={data.property} 
      expenses={data.expenses} 
      refactionImages={data.refactionImages}
    />
  );
}