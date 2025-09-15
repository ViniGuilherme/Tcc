import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({ 
  selectedDate, 
  onChange, 
  placeholder = "Selecione uma data",
  className = ""
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    // Retorna true se a data for anterior a hoje (para desabilitar)
    return dateToCheck < today;
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            filterDate={(date) => !isDateDisabled(date)}
            minDate={new Date()}
            inline
            calendarStartDay={1} // Começa na segunda-feira
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
            showPopperArrow={false}
            className="border-0"
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {date.toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  }).charAt(0).toUpperCase() + 
                  date.toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  }).slice(1)}
                </h2>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            dayClassName={(date) => {
              const today = new Date();
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              const isDisabled = isDateDisabled(date);
              
              let className = 'hover:bg-gray-100 rounded text-center py-2 cursor-pointer';
              
              if (isToday) className += ' bg-yellow-100 text-yellow-800 font-semibold';
              if (isSelected) className += ' bg-yellow-500 text-white hover:bg-yellow-600';
              if (isDisabled) className += ' text-gray-300 cursor-not-allowed hover:bg-transparent';
              
              return className;
            }}
            weekDayClassName={(date) => 
              'text-center py-2 text-sm font-medium text-gray-500'
            }
          />
        </div>
      )}

      {/* Overlay para fechar o calendário ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
