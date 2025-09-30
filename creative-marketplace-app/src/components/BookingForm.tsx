import React, { useState } from 'react';

const BookingForm = () => {
    const [creative, setCreative] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!creative) newErrors.creative = 'Creative is required';
        if (!date) newErrors.date = 'Date is required';
        if (!time) newErrors.time = 'Time is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            // Handle form submission logic here
            console.log({ creative, date, time, specialRequests });
            // Reset form
            setCreative('');
            setDate('');
            setTime('');
            setSpecialRequests('');
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Select Creative:
                    <input
                        type="text"
                        value={creative}
                        onChange={(e) => setCreative(e.target.value)}
                    />
                </label>
                {errors.creative && <span>{errors.creative}</span>}
            </div>
            <div>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                {errors.date && <span>{errors.date}</span>}
            </div>
            <div>
                <label>
                    Time:
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </label>
                {errors.time && <span>{errors.time}</span>}
            </div>
            <div>
                <label>
                    Special Requests:
                    <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit">Book Now</button>
        </form>
    );
};

export default BookingForm;
// This code defines a BookingForm component that allows users to book a creative service by selecting a creative, date, time, and providing special requests. It includes form validation and handles form submission. The form resets after submission if there are no errors.
// The component uses React hooks for state management and form handling. It displays error messages for required fields if they are not filled out. The form includes inputs for selecting a creative, date, time, and a textarea for special requests. Upon submission, it validates the inputs and either displays errors or logs the booking details to the console. The form is reset after a successful submission.
// The component is designed to be reusable and can be integrated into a larger application where booking functionality is needed. It can be styled further with CSS or integrated with a UI library for better aesthetics.     
