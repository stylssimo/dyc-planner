import { useState } from 'react';
import { X } from 'lucide-react';

const ConsultationDateModal = ({ isOpen, onClose, onSubmit, tripName }: { isOpen: boolean, onClose: () => void, onSubmit: (data: { date: string, time: string, notes: string }) => void, tripName: string }) => {
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedTime, setSelectedTime] = useState('');
        const [notes, setNotes] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
    
        // Generate available dates (next 30 days, excluding weekends)
        const generateAvailableDates = () => {
            const dates = [];
            const today = new Date();
            
            for (let i = 1; i <= 45; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                
                // Skip weekends
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                    dates.push(date.toISOString().split('T')[0]);
                }
            }
            
            return dates;
        };
    
        // Generate available time slots
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ];
    
        const availableDates = generateAvailableDates();
    
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!selectedDate || !selectedTime) {
                alert('Please select both date and time for your consultation.');
                return;
            }
    
            setIsSubmitting(true);
            try {
                await onSubmit({
                    date: selectedDate,
                    time: selectedTime,
                    notes: notes.trim()
                });
                
                // Reset form
                setSelectedDate('');
                setSelectedTime('');
                setNotes('');
                onClose();
            } catch (error) {
                console.error('Error submitting consultation request:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
    
        const formatDateForDisplay = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };
    
        if (!isOpen) return null;
    
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                ></div>
                
                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Schedule Consultation</h3>
                            <p className="text-sm text-gray-600 mt-1">Book a consultation for "{tripName}"</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Date Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Date
                            </label>
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a date</option>
                                {availableDates.map(date => (
                                    <option key={date} value={date}>
                                        {formatDateForDisplay(date)}
                                    </option>
                                ))}
                            </select>
                        </div>
    
                        {/* Time Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Time
                            </label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={!selectedDate}
                            >
                                <option value="">Select a time</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            {!selectedDate && (
                                <p className="text-xs text-gray-500 mt-1">Please select a date first</p>
                            )}
                        </div>
    
                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Requests or Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific requirements, questions, or preferences you'd like to discuss..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={3}
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
                        </div>
    
                        {/* Summary */}
                        {selectedDate && selectedTime && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Consultation Summary:</h4>
                                <div className="text-sm text-blue-800">
                                    <p><strong>Trip:</strong> {tripName}</p>
                                    <p><strong>Date:</strong> {formatDateForDisplay(selectedDate)}</p>
                                    <p><strong>Time:</strong> {selectedTime}</p>
                                    {notes && <p><strong>Notes:</strong> {notes}</p>}
                                </div>
                            </div>
                        )}
    
                        {/* Actions */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedDate || !selectedTime}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    export default ConsultationDateModal