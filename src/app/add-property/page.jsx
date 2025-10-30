'use client';
import AddPropertyForm from '../../components/AddPropertyForm';
import Navbar from '../../components/NavBar';
import withAuth from '../../components/WithAuth';

const AddPropertyContent = () => {
  return (
    <>
      <Navbar />
      <main className="main">
        <AddPropertyForm />
      </main>
    </>
  );
};

export default withAuth(AddPropertyContent);