// src/screens/Profile/components/CalendarSection.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SectionWrapper from './SectionWrapper';
import { Ionicons } from '@expo/vector-icons';

interface CalendarSectionProps {
  isEditing: boolean;
  bookingDates: { [key: string]: 'available' | 'booked' | 'editing' };
  setBookingDates: (dates: { [key: string]: 'available' | 'booked' | 'editing' }) => void;
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_ACCENT_BUTTON = '#7B1FF0';
const BRAND_RED = '#D9534F'; 
const BRAND_GREEN = '#4CD964'; 
const CARD_BACKGROUND_OPACITY = 'rgba(26, 10, 58, 0.4)';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MAX_YEAR = 2030;

const CalendarSection: React.FC<CalendarSectionProps> = ({ 
    isEditing, 
    bookingDates = {}, 
    setBookingDates 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  
  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarGrid: (null | { day: number; dateString: string })[] = [];
  
  // Add null entries for padding at the start of the month
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.push(null);
  }
  
  // Add day objects
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    calendarGrid.push({ day, dateString });
  }

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentYear, currentMonth + delta, 1);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    
    // Check if the new year exceeds the MAX_YEAR
    if (delta > 0 && newYear > MAX_YEAR) {
        Alert.alert("Date Limit Reached", `You can only view up to ${MAX_YEAR}.`);
        return;
    }
    
    // Prevent going backwards past the current month/year
    const currentMonthYear = today.getFullYear() * 12 + today.getMonth();
    const newMonthYear = newYear * 12 + newMonth;

    if (delta < 0 && newMonthYear < currentMonthYear) {
        return; 
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  };
  
  const getDayStyle = (dateString: string, dayNumber: number) => {
    const status = bookingDates[dateString] || 'available';
    const isSelected = selectedDate === dateString;

    const date = new Date(dateString);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < startOfToday && !isToday;

    let textColor = BRAND_TEXT_LIGHT;
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    
    if (isPast) {
        textColor = BRAND_TEXT_GREY;
        borderColor = 'transparent';
    } else if (isToday) {
        borderColor = BRAND_ACCENT_BUTTON;
    }
    
    if (isSelected) {
        backgroundColor = 'rgba(123, 31, 240, 0.5)';
        borderColor = BRAND_TEXT_LIGHT;
        textColor = BRAND_TEXT_LIGHT; 
    }

    return { 
        containerStyles: [calendarStyles.dayBox, { backgroundColor, borderColor }], 
        textColor, 
        isPast 
    };
  };
  
  const handleDatePress = (dayObj: { day: number, dateString: string }) => {
      const dateString = dayObj.dateString;
      const dayStatus = bookingDates[dateString] || 'available';

      const date = new Date(dateString);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const isPast = date < startOfToday;

      if (isPast) return;

      setSelectedDate(dateString);
      
      if (isEditing) {
          const newStatus = dayStatus === 'available' ? 'booked' : 'available';
          setBookingDates({ ...bookingDates, [dateString]: newStatus });
      } else {
          if (dayStatus === 'available') {
              Alert.alert(
                  'Book Appointment',
                  `You have selected ${new Date(dateString).toDateString()}. Proceed to booking form?`,
                  [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Book Now', onPress: () => console.log(`Booking initiated for ${dateString}`) }
                  ]
              );
          } else {
              Alert.alert('Unavailable', 'This date is already booked. Please select another.');
          }
      }
  };

  // Determine if forward button should be disabled
  const isNextYearPastLimit = currentYear >= MAX_YEAR && currentMonth === 11;

  return (
    <SectionWrapper title="Availability Calendar">
      <View style={calendarStyles.calendarWrapper}>
        {/* Month Navigation */}
        <View style={calendarStyles.monthHeader}>
          <TouchableOpacity 
            onPress={() => changeMonth(-1)}
            style={{ opacity: currentYear === today.getFullYear() && currentMonth === today.getMonth() ? 0.4 : 1 }}
          >
            <Ionicons name="chevron-back-outline" size={24} color={BRAND_TEXT_LIGHT} />
          </TouchableOpacity>

          <Text style={calendarStyles.monthText}>
            {new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity 
            onPress={() => changeMonth(1)} 
            disabled={isNextYearPastLimit}
          >
            <Ionicons 
                name="chevron-forward-outline" 
                size={24} 
                color={isNextYearPastLimit ? BRAND_TEXT_GREY : BRAND_TEXT_LIGHT} 
            />
          </TouchableOpacity>
        </View>

        <View style={calendarStyles.daysRow}>
          {DAY_NAMES.map((day, index) => (
            <Text key={index} style={calendarStyles.dayName}>{day}</Text>
          ))}
        </View>

        <View style={calendarStyles.calendarGrid}>
          {calendarGrid.map((dayObj, index) => {
            // If dayObj is null (for padding cells), return an empty View container
            if (dayObj === null) {
              return <View key={index} style={calendarStyles.dayCell} />;
            }

            const dateString = dayObj.dateString;
            const dayStatus = bookingDates[dateString] || 'available';
            const dayNumber = dayObj.day;

            const dayStyleProps = getDayStyle(dateString, dayNumber);

            return (
              <TouchableOpacity
                key={index}
                style={[calendarStyles.dayCell, dayStyleProps.isPast && calendarStyles.disabledCell]}
                disabled={dayStyleProps.isPast || (!isEditing && dayStatus === 'booked')}
                onPress={() => handleDatePress(dayObj)}
              >
                <View style={dayStyleProps.containerStyles}>
                  <Text style={[calendarStyles.dayText, { color: dayStyleProps.textColor }]}>
                    {dayNumber}
                  </Text> 
                  
                  {/* Show dots only for current/future dates */}
                  {!dayStyleProps.isPast && dateString && dayStatus === 'booked' && (
                      <View style={calendarStyles.statusDotBooked} />
                  )}
                  {!dayStyleProps.isPast && dateString && dayStatus === 'available' && (
                      <View style={calendarStyles.statusDotAvailable} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={calendarStyles.legendContainer}>
            <View style={calendarStyles.legendItem}>
                <View style={[calendarStyles.legendDot, { backgroundColor: BRAND_GREEN }]} />
                <Text style={calendarStyles.legendText}>Available</Text>
            </View>
            <View style={calendarStyles.legendItem}>
                <View style={[calendarStyles.legendDot, { backgroundColor: BRAND_RED }]} />
                <Text style={calendarStyles.legendText}>Booked</Text>
            </View>
        </View>
      </View>
    </SectionWrapper>
  );
};

// Renamed from 'styles' to 'calendarStyles' to avoid conflicts
const calendarStyles = StyleSheet.create({
  calendarWrapper: { backgroundColor: CARD_BACKGROUND_OPACITY, borderRadius: 12, padding: 15 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  monthText: { color: BRAND_TEXT_LIGHT, fontSize: 18, fontWeight: 'bold' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
  dayName: { color: BRAND_TEXT_GREY, width: '14%', textAlign: 'center', fontWeight: '600', fontSize: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 3 },
  disabledCell: { opacity: 0.5 },
  dayBox: { width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', borderWidth: 2, position: 'relative' },
  dayText: { fontSize: 14, fontWeight: '600' },
  statusDotBooked: { position: 'absolute', bottom: 3, right: 3, width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND_RED },
  statusDotAvailable: { position: 'absolute', bottom: 3, right: 3, width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND_GREEN },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { color: BRAND_TEXT_GREY, fontSize: 12 },
});

export default CalendarSection;