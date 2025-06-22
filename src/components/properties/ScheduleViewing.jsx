import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, Loader, X, Info, CheckCircle, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Backendurl } from '../../App';
import { useNavigate } from 'react-router-dom';

const ScheduleViewing = ({ propertyId, propertyTitle, propertyLocation, propertyImage, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const validatePersonalInfo = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should only contain letters and spaces';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      valid = false;
    } else {
      const email = formData.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
        valid = false;
      } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
        newErrors.email = 'Please enter a valid email format (example@domain.com)';
        valid = false;
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: date/time, 2: personal info, 3: notes/confirmation
  const [isSuccess, setIsSuccess] = useState(false);

  // Available time slots from 9 AM to 6 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Calculate date restrictions
  const dateRestrictions = useMemo(() => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    // Set time to beginning of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    return {
      min: today.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  }, []);

  const isWeekend = (date) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const isPastTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const selected = new Date(formData.date);
    selected.setHours(hours, minutes);

    return selected < now;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (isWeekend(selectedDate)) {
      toast.error('Viewings are not available on weekends');
      return;
    }
    setFormData(prev => ({ ...prev, date: selectedDate, time: '' }));
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (formData.date === dateRestrictions.min && isPastTime(selectedTime)) {
      toast.error('Please select a future time slot');
      return;
    }
    setFormData(prev => ({ ...prev, time: selectedTime }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${Backendurl}/api/appointments/schedule`, {
        propertyId: propertyId,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      setIsSuccess(true);
      // Redirect to home page after 3.5 seconds
      setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 3500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule viewing');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if form can proceed to next step
  const canProceedToStep2 = formData.date && formData.time;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors z-10"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          {!isSuccess ? (
            <>
              {/* Header with property info */}
              <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                {propertyImage && (
                  <div className="mr-4 flex-shrink-0">
                    <img 
                      src={propertyImage} 
                      alt={propertyTitle} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 truncate">Schedule a Call</h2>
                  {propertyTitle && (
                    <p className="text-gray-700 font-medium truncate">{propertyTitle}</p>
                  )}
                  {propertyLocation && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{propertyLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs">Date & Time</span>
                  </div>
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200">
                    <div className={`h-full bg-blue-600 transition-all duration-300`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                  </div>
                  <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-xs">Personal Info</span>
                  </div>
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200">
                    <div className={`h-full bg-blue-600 transition-all duration-300`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                  </div>
                  <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs">Verify</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.date}
                          onChange={handleDateChange}
                          min={dateRestrictions.min}
                          max={dateRestrictions.max}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          required
                          disabled={loading}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                        <Info className="w-3 h-3 mr-1 inline flex-shrink-0" />
                        Available Monday to Friday, up to 30 days in advance
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time Slot
                      </label>
                      <div className="relative">
                        <select
                          value={formData.time}
                          onChange={handleTimeChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                          required
                          disabled={!formData.date || loading}
                        >
                          <option value="">Choose a time slot</option>
                          {timeSlots.map((slot) => (
                            <option 
                              key={slot} 
                              value={slot}
                              disabled={formData.date === dateRestrictions.min && isPastTime(slot)}
                            >
                              {slot}
                            </option>
                          ))}
                        </select>
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                        <Info className="w-3 h-3 mr-1 inline flex-shrink-0" />
                        Available from 9:00 AM to 6:00 PM
                      </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="lg:w-1/2 order-2 lg:order-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => canProceedToStep2 && setStep(2)}
                        disabled={!canProceedToStep2 || loading}
                        className="lg:w-1/2 order-1 lg:order-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          setFormData(prev => ({ ...prev, name: value }));
                          if (!value.trim()) {
                            setErrors(prev => ({ ...prev, name: 'Full name is required' }));
                          } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                            setErrors(prev => ({ ...prev, name: 'Name should only contain letters and spaces' }));
                          } else {
                            setErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${errors.name ? 'border-red-500' : ''}`}
                        required
                        disabled={loading}
                        placeholder="Enter Your Name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 10) {
                              setFormData(prev => ({ ...prev, phone: value }));
                              if (!value.trim()) {
                                setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
                              } else if (value.length < 10) {
                                setErrors(prev => ({ ...prev, phone: 'Please enter 10 digits' }));
                              } else {
                                setErrors(prev => ({ ...prev, phone: '' }));
                              }
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${errors.phone ? 'border-red-500' : ''}`}
                          maxLength="10"
                          required
                          disabled={loading}
                          placeholder="Enter Your Number"
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                          +91
                        </span>
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ ...prev, email: value }));
                          if (!value.trim()) {
                            setErrors(prev => ({ ...prev, email: 'Email address is required' }));
                          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                          } else {
                            setErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${errors.email ? 'border-red-500' : ''}`}
                        required
                        disabled={loading}
                        placeholder="Enter Your Email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="lg:w-1/2 order-2 lg:order-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (validatePersonalInfo()) {
                            setStep(3);
                          }
                        }}
                        disabled={loading}
                        className="lg:w-1/2 order-1 lg:order-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Selected Time</h3>
                        <button 
                          type="button" 
                          onClick={() => setStep(1)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{formatDate(formData.date)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{formData.time}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
                        <button 
                          type="button" 
                          onClick={() => setStep(2)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-gray-700">{formData.name}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-gray-700">{formData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-700">{formData.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={loading}
                        className="lg:w-1/2 order-2 lg:order-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="lg:w-1/2 order-1 lg:order-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                          transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Information'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Scheduled!</h3>
              <p className="text-gray-600 mb-6">
                We've sent you a confirmation email with all the details.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 max-w-xs mx-auto mb-6">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">{formatDate(formData.date)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">{formData.time}</span>
                </div>
                {propertyTitle && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700 text-sm">{propertyTitle}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                One of our agents will contact you to confirm the details.
              </p>
              
              <button
                onClick={onClose}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
          
          {/* Additional services info */}
          {!isSuccess && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 text-blue-600 mr-2" />
                <span>A qualified agent will guide you through the Call</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleViewing;