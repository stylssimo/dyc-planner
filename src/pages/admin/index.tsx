import AdminConsultations from './consulations';

const AdminIndex = () => {

  const currentPage = 'dashboard';

  const renderCurrentPage = () => {
    switch (currentPage) {
      default:
        return <AdminConsultations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
    </div>
  );
};

export default AdminIndex;