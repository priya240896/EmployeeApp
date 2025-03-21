import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output,ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-date-picker.component.html',
  styleUrl: './custom-date-picker.component.css'
})
export class CustomDatePickerComponent implements OnInit {
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

  constructor(private elementRef: ElementRef,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.selectedDate && !this.isEndDatePicker) {
      this.selectedDate = new Date();
    }

    if (this.selectedDate) {
      this.tempSelectedDate = new Date(this.selectedDate);
      this.currentDate = new Date(this.selectedDate);
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
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
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

  @HostListener('window:resize')
  checkPosition() {
    setTimeout(() => {
      if (this.showCalendar) {
        const popup = this.elementRef.nativeElement.querySelector('.calendar-popup');
        const container = this.elementRef.nativeElement.querySelector('.date-input-container');

        if (popup && container) {
          const containerRect = container.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const popupWidth = popup.offsetWidth;

          let left = containerRect.left;
          if (left + popupWidth > viewportWidth) {
            left = Math.max(0, containerRect.right - popupWidth);
          }

          popup.style.left = `${left}px`;
          popup.style.top = `${containerRect.bottom + 8}px`;
        }
      }
    }, 0);
  }

  toggleCalendar(event?: Event) {
    if (event) event.stopPropagation();
    this.showCalendar = !this.showCalendar;

    if (this.showCalendar) {
      this.tempSelectedDate = this.selectedDate ? new Date(this.selectedDate) : (this.isEndDatePicker ? null : new Date());
      this.currentDate = new Date();
      this.updateCalendar();
      setTimeout(() => this.checkPosition(), 10);
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return this.isEndDatePicker ? 'No date' : '';
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  }

  selectDate(date: Date) {
    const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0);
    this.dateChange.emit(localDate);
  }

  isSelected(date: Date): boolean {
    return this.tempSelectedDate 
      ? date.getDate() === this.tempSelectedDate.getDate() && 
        date.getMonth() === this.tempSelectedDate.getMonth() && 
        date.getFullYear() === this.tempSelectedDate.getFullYear()
      : false;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  isDisabled(date: Date): boolean {
    return this.minDate ? date < this.minDate : false;
  }

  previousMonth(event?: Event) {
    if (event) event.stopPropagation();
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth(event?: Event) {
    if (event) event.stopPropagation();
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  selectToday(event?: Event) {
    if (event) event.stopPropagation();
    this.tempSelectedDate = new Date();
    this.selectedDate= this.tempSelectedDate 
    this.dateChange.emit(this.selectedDate); // Emit event to update input field
    this.currentDate = new Date();
    this.updateCalendar();
  }

  selectNextMonday(event?: Event) {
    if (event) event.stopPropagation();
    const date = new Date();
    date.setDate(date.getDate() + ((8 - date.getDay()) % 7));
    this.tempSelectedDate = date;
    this.selectedDate= this.tempSelectedDate 
    this.dateChange.emit(this.selectedDate); 
    this.currentDate = new Date(date);
    this.updateCalendar();
  }

  selectNextTuesday(event?: Event) {
    if (event) event.stopPropagation();
    const date = new Date();
    date.setDate(date.getDate() + ((9 - date.getDay()) % 7));
    this.tempSelectedDate = date;
    this.selectedDate= this.tempSelectedDate
    this.dateChange.emit(this.selectedDate);  
    this.currentDate = new Date(date);
    this.updateCalendar();
  }

  selectNextWeek(event?: Event) {
    if (event) event.stopPropagation();
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.tempSelectedDate = date;
    this.selectedDate= this.tempSelectedDate 
    this.dateChange.emit(this.selectedDate); 
    this.currentDate = new Date(date);
    this.updateCalendar();
  }

  saveDate(event?: Event) {
    if (event) event.preventDefault();
    this.dateChange.emit(this.selectedDate);
    this.cdr.detectChanges(); // Force Angular to update the view
    this.showCalendar = false;
  }

  cancel(event?: Event) {
    event?.preventDefault();
    this.showCalendar = false;
  }

  clearDate(event?: Event) {
    if (event) event.stopPropagation();
    this.tempSelectedDate = null;
    this.selectedDate = null;
    this.dateChange.emit(null);
    this.showCalendar = false;
  }
}
