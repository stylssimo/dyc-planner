
const PictureModal = ({ isOpen, onClose, imageUrl }: { isOpen: boolean, onClose: () => void, imageUrl: string }) => {
    if (!isOpen) return null;
    return (
      <>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-5 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <img 
              src={imageUrl} 
              alt="Trip Image" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      )}
      </>
    );
  };

export default PictureModal