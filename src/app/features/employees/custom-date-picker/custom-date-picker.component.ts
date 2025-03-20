import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-date-picker.component.html',
  styleUrl: './custom-date-picker.component.css'
})
export class CustomDatePickerComponent implements OnInit{
  @Input() selectedDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() isEndDatePicker: boolean = false;
  @Output() dateChange: EventEmitter<Date | null> = new EventEmitter();


  showCalendar = false;
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Date[] = [];
  tempSelectedDate: Date | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // For end date picker, don't set a default date if selectedDate is null
    if (!this.selectedDate && !this.isEndDatePicker) {
      this.selectedDate = new Date();
    }
    
    // Only set tempSelectedDate if there's a selectedDate
    if (this.selectedDate) {
      this.tempSelectedDate = new Date(this.selectedDate);
      this.currentDate = new Date(this.selectedDate);
    } else {
      // For null selectedDate (end date picker), set currentDate to today
      // but keep tempSelectedDate as null
      this.currentDate = new Date();
      this.tempSelectedDate = null;
    }
    
    this.updateCalendar();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.showCalendar && !this.elementRef.nativeElement.contains(event.target)) {
      this.showCalendar = false;
    }
  }

  updateCalendar() {
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    this.currentMonth = firstDay.toLocaleString('default', { month: 'long' });
    this.currentYear = firstDay.getFullYear();

    this.calendarDays = [];
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      this.calendarDays.push(new Date(startDay));
      startDay.setDate(startDay.getDate() + 1);
    }
  }

  // Update the checkPosition method to better handle positioning
  @HostListener('window:resize')
  checkPosition() {
    setTimeout(() => {
      if (this.showCalendar) {
        const popup = this.elementRef.nativeElement.querySelector('.calendar-popup');
        const container = this.elementRef.nativeElement.querySelector('.date-input-container');
        
        if (popup && container) {
          const containerRect = container.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          const popupHeight = popup.offsetHeight;
          const popupWidth = popup.offsetWidth;
          
          // Position the popup relative to the input container
          popup.style.position = 'fixed';
          
          // Calculate horizontal position
          let left = containerRect.left;
          if (left + popupWidth > viewportWidth) {
            left = Math.max(0, containerRect.right - popupWidth);
          }
          
          // Calculate vertical position
          let top = containerRect.bottom + 8;
          if (top + popupHeight > viewportHeight) {
            // Position above if not enough space below
            top = Math.max(0, containerRect.top - popupHeight - 8);
          }
          
          popup.style.left = `${left}px`;
          popup.style.top = `${top}px`;
        }
      }
    }, 0);
  }

  toggleCalendar(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      // For end date picker with null selectedDate, keep tempSelectedDate as null
      if (this.selectedDate) {
        this.tempSelectedDate = new Date(this.selectedDate);
        this.currentDate = new Date(this.selectedDate);
      } else {
        this.tempSelectedDate = this.isEndDatePicker ? null : new Date();
        this.currentDate = new Date();
      }
      this.updateCalendar();
      
      // Use setTimeout to ensure DOM is updated before checking position
      setTimeout(() => {
        this.checkPosition();
      }, 10);
    }
  }

  // Keep only this formatDate method and remove the other one
  formatDate(date: Date | null): string {
    if (!date) {
      // Show "No date" for the end date picker when no date is selected
      return this.isEndDatePicker ? 'No date' : '';
    }
    
    // Format as "5 Sep 2025"
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  selectDate(date: Date) {
    console.log('Emitting Date:', date);
    this.dateChange.emit(date); 
    // this.tempSelectedDate = new Date(date);
    // No need to call updateCalendar here as it might reset the view
  }

  isSelected(date: Date): boolean {
    if (!this.tempSelectedDate) return false;
    return (
      date.getDate() === this.tempSelectedDate.getDate() &&
      date.getMonth() === this.tempSelectedDate.getMonth() &&
      date.getFullYear() === this.tempSelectedDate.getFullYear()
    );
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isDisabled(date: Date): boolean {
    if (!this.minDate) return false;
    return date < this.minDate;
  }

  // Update the month navigation methods to prevent event propagation
  previousMonth(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  selectToday(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.tempSelectedDate = new Date();
    this.currentDate = new Date();
    this.updateCalendar();
  }
  
  selectNextMonday(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const date = new Date();
    date.setDate(date.getDate() + ((8 - date.getDay()) % 7));
    this.tempSelectedDate = date;
    this.currentDate = new Date(date);
    this.updateCalendar();
  }
  
  selectNextTuesday(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const date = new Date();
    date.setDate(date.getDate() + ((9 - date.getDay()) % 7));
    this.tempSelectedDate = date;
    this.currentDate = new Date(date);
    this.updateCalendar();
  }
  
  selectNextWeek(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.tempSelectedDate = date;
    this.currentDate = new Date(date);
    this.updateCalendar();
  }
  
  save() {
    if (this.tempSelectedDate) {
      this.selectedDate = new Date(this.tempSelectedDate);
      this.dateChange.emit(this.selectedDate);
      this.showCalendar = false;
    }
  }

  cancel() {
    this.showCalendar = false;
  }
  
  clearDate(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.tempSelectedDate = null;
    this.selectedDate = null;
    this.dateChange.emit(null);
    this.showCalendar = false;
  }

}


