import AddPropertyForm from '../../components/AddPropertyForm';
import Navbar from '../../components/Navbar';

export default function AddPropertyPage() {
  return (
    <>
      <Navbar />
      <main className="main">
        <AddPropertyForm />
      </main>
    </>
  );
}