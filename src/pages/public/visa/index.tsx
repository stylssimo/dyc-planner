import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin, Users, FileText, Upload, X } from 'lucide-react';

interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
}

interface TravelInfo {
    destination: string;
    visaType: string;
    purposeOfVisit: string;
    arrivalDate: string;
    departureDate: string;
    numberOfEntries: string;
    accommodationAddress: string;
}

interface DocumentInfo {
    passportCopy: File | null;
    photo: File | null;
    supportingDocs: File[];
    additionalNotes: string;
}

const VisaPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form data states
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: ''
    });

    const [travelInfo, setTravelInfo] = useState<TravelInfo>({
        destination: '',
        visaType: '',
        purposeOfVisit: '',
        arrivalDate: '',
        departureDate: '',
        numberOfEntries: '',
        accommodationAddress: ''
    });

    const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({
        passportCopy: null,
        photo: null,
        supportingDocs: [],
        additionalNotes: ''
    });

    const steps = [
        { id: 1, title: 'Personal Information', icon: Users },
        { id: 2, title: 'Travel Details', icon: MapPin },
        { id: 3, title: 'Documents', icon: FileText },
        { id: 4, title: 'Review & Submit', icon: Check }
    ];

    const visaTypes = [
        'Tourist Visa',
        'Business Visa',
        'Student Visa',
        'Work Visa',
        'Transit Visa'
    ];

    const countries = [
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Singapore'
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
        if (field === 'supportingDocs' && file) {
            setDocumentInfo(prev => ({
                ...prev,
                supportingDocs: [...prev.supportingDocs, file]
            }));
        } else {
            setDocumentInfo(prev => ({
                ...prev,
                [field]: file
            }));
        }
    };

    const removeFile = (field: keyof DocumentInfo, index?: number) => {
        if (field === 'supportingDocs' && typeof index === 'number') {
            setDocumentInfo(prev => ({
                ...prev,
                supportingDocs: prev.supportingDocs.filter((_, i) => i !== index)
            }));
        } else {
            setDocumentInfo(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Visa application submitted successfully! You will receive a confirmation email shortly.');
        setIsSubmitting(false);
    };

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(personalInfo.firstName && personalInfo.lastName && personalInfo.email && 
                         personalInfo.phone && personalInfo.dateOfBirth && personalInfo.nationality && 
                         personalInfo.passportNumber && personalInfo.passportExpiry);
            case 2:
                return !!(travelInfo.destination && travelInfo.visaType && travelInfo.purposeOfVisit && 
                         travelInfo.arrivalDate && travelInfo.departureDate && travelInfo.numberOfEntries);
            case 3:
                return !!(documentInfo.passportCopy && documentInfo.photo);
            default:
                return true;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.firstName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.lastName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={personalInfo.phone}
                                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    value={personalInfo.dateOfBirth}
                                    onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nationality *
                                </label>
                                <select
                                    value={personalInfo.nationality}
                                    onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select nationality</option>
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passport Number *
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.passportNumber}
                                    onChange={(e) => setPersonalInfo({...personalInfo, passportNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passport Expiry Date *
                                </label>
                                <input
                                    type="date"
                                    value={personalInfo.passportExpiry}
                                    onChange={(e) => setPersonalInfo({...personalInfo, passportExpiry: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Travel Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Destination Country *
                                </label>
                                <select
                                    value={travelInfo.destination}
                                    onChange={(e) => setTravelInfo({...travelInfo, destination: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select destination</option>
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visa Type *
                                </label>
                                <select
                                    value={travelInfo.visaType}
                                    onChange={(e) => setTravelInfo({...travelInfo, visaType: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select visa type</option>
                                    {visaTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose of Visit *
                                </label>
                                <input
                                    type="text"
                                    value={travelInfo.purposeOfVisit}
                                    onChange={(e) => setTravelInfo({...travelInfo, purposeOfVisit: e.target.value})}
                                    placeholder="Tourism, Business, Study, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Entries *
                                </label>
                                <select
                                    value={travelInfo.numberOfEntries}
                                    onChange={(e) => setTravelInfo({...travelInfo, numberOfEntries: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select entries</option>
                                    <option value="single">Single Entry</option>
                                    <option value="multiple">Multiple Entry</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Arrival Date *
                                </label>
                                <input
                                    type="date"
                                    value={travelInfo.arrivalDate}
                                    onChange={(e) => setTravelInfo({...travelInfo, arrivalDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departure Date *
                                </label>
                                <input
                                    type="date"
                                    value={travelInfo.departureDate}
                                    onChange={(e) => setTravelInfo({...travelInfo, departureDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Accommodation Address
                                </label>
                                <textarea
                                    value={travelInfo.accommodationAddress}
                                    onChange={(e) => setTravelInfo({...travelInfo, accommodationAddress: e.target.value})}
                                    placeholder="Hotel or accommodation address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passport Copy * (PDF, JPG, PNG - Max 5MB)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {documentInfo.passportCopy ? (
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <span className="text-sm text-gray-700">{documentInfo.passportCopy.name}</span>
                                            <button
                                                onClick={() => removeFile('passportCopy')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileUpload('passportCopy', e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="passport-upload"
                                            />
                                            <label
                                                htmlFor="passport-upload"
                                                className="cursor-pointer text-blue-600 hover:text-blue-700"
                                            >
                                                Click to upload passport copy
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passport Photo * (JPG, PNG - Max 2MB)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {documentInfo.photo ? (
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <span className="text-sm text-gray-700">{documentInfo.photo.name}</span>
                                            <button
                                                onClick={() => removeFile('photo')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="cursor-pointer text-blue-600 hover:text-blue-700"
                                            >
                                                Click to upload passport photo
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Supporting Documents (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {documentInfo.supportingDocs.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {documentInfo.supportingDocs.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                    <button
                                                        onClick={() => removeFile('supportingDocs', index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileUpload('supportingDocs', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="supporting-upload"
                                            multiple
                                        />
                                        <label
                                            htmlFor="supporting-upload"
                                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                                        >
                                            Click to upload supporting documents
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Travel insurance, bank statements, etc.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={documentInfo.additionalNotes}
                                    onChange={(e) => setDocumentInfo({...documentInfo, additionalNotes: e.target.value})}
                                    placeholder="Any additional information or special requests..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h3>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-600">Name:</span> {personalInfo.firstName} {personalInfo.lastName}</div>
                                    <div><span className="text-gray-600">Email:</span> {personalInfo.email}</div>
                                    <div><span className="text-gray-600">Phone:</span> {personalInfo.phone}</div>
                                    <div><span className="text-gray-600">Nationality:</span> {personalInfo.nationality}</div>
                                    <div><span className="text-gray-600">Passport:</span> {personalInfo.passportNumber}</div>
                                    <div><span className="text-gray-600">Date of Birth:</span> {personalInfo.dateOfBirth}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Travel Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-600">Destination:</span> {travelInfo.destination}</div>
                                    <div><span className="text-gray-600">Visa Type:</span> {travelInfo.visaType}</div>
                                    <div><span className="text-gray-600">Purpose:</span> {travelInfo.purposeOfVisit}</div>
                                    <div><span className="text-gray-600">Entries:</span> {travelInfo.numberOfEntries}</div>
                                    <div><span className="text-gray-600">Arrival:</span> {travelInfo.arrivalDate}</div>
                                    <div><span className="text-gray-600">Departure:</span> {travelInfo.departureDate}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>Passport Copy: {documentInfo.passportCopy?.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>Passport Photo: {documentInfo.photo?.name}</span>
                                    </div>
                                    {documentInfo.supportingDocs.length > 0 && (
                                        <div>
                                            <span className="text-gray-600">Supporting Documents:</span>
                                            <ul className="ml-6 mt-1">
                                                {documentInfo.supportingDocs.map((doc, index) => (
                                                    <li key={index} className="flex items-center space-x-2">
                                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                        <span>{doc.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Processing time is typically 5-10 business days</li>
                                    <li>• You will receive email updates on your application status</li>
                                    <li>• Ensure all information is accurate before submitting</li>
                                    <li>• Additional documents may be requested during processing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-600 hover:text-gray-800">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Services
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <h1 className="text-2xl font-bold text-gray-900">Visa Application</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const isAccessible = currentStep >= step.id || isCompleted;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                isCompleted
                                                    ? 'bg-green-600 border-green-600 text-white'
                                                    : isActive
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : isAccessible
                                                    ? 'border-gray-300 text-gray-400 hover:border-blue-600 cursor-pointer'
                                                    : 'border-gray-200 text-gray-300'
                                            }`}
                                            onClick={() => isAccessible && setCurrentStep(step.id)}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs mt-2 text-center max-w-20 ${
                                                isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                                            }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-16 h-0.5 mx-4 ${
                                                currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </button>

                    {currentStep === steps.length ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Application
                                    <Check className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid(currentStep)}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:dyc@gmail.com" className="text-blue-600 hover:text-blue-700">
                            dyc@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VisaPage;