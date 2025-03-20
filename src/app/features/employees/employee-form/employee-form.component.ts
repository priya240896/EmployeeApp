import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { db } from '../../../core/database/employee-db';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule,CommonModule, NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,CustomDatePickerComponent], 
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})

export class EmployeeFormComponent {
  // @Input() employee: Employee = { id: undefined, name: '', role: '', joiningDate: '',lastDate:'' };
  // @Output() save = new EventEmitter<Employee>();
  // @Output() cancel = new EventEmitter<void>();
  employee: Employee = { name: '', role: '', joiningDate: '', lastDate: '' };
  isEditMode = false;

  iseditHeader=false;
  isaddHeader=false;
  employeeId: number | null = null; 
  isDatePickerOpen = false;
  isEditing: boolean = false;
  @ViewChild('joiningPicker') joiningPicker!: MatDatepicker<Date>;
  @ViewChild('lastPicker') lastPicker!: MatDatepicker<Date>;
  today: string = new Date().toISOString().split('T')[0]; // Gets today's date in YYYY-MM-DD format
  minStartDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      const employeeId = Number(id);
      const employees = this.employeeService.employees();
      this.employee = employees.find(emp => emp.id === employeeId) || this.employee;
    }
  }

  get formattedJoiningDate(): Date | null {
    return this.employee.joiningDate ? new Date(this.employee.joiningDate) : null;
  }

  get formattedLastDate(): Date | null {
    return this.employee.lastDate ? new Date(this.employee.lastDate) : null;
  } 
  getMinLastDate(): Date {
    const joiningDate = this.employee.joiningDate;
  
    if (joiningDate instanceof Date) {
      return joiningDate;
    }
  
    if (typeof joiningDate === 'string' && !isNaN(Date.parse(joiningDate))) {
      return new Date(joiningDate); 
    }
  
    return this.minStartDate; 
  }


  onDateSelected(event: any) {
    console.log('Received event:', event, typeof event); // Debugging log
  
    if (event instanceof Date) {
      this.handleStartDateChange(event);
    } else {
      console.error('Error: Expected Date but got:', event);
    }
  }
 
  handleStartDateChange(date: Date) {
    this.employee.joiningDate = date.toISOString().split('T')[0]; // Convert Date to string
  }
  onLastDateSelected(event: any) {
    console.log('Received event for Last Date:', event, typeof event); // Debugging log
  
    if (event instanceof Date) {
      this.handleLastDateChange(event);
    } else {
      console.error('Error: Expected Date but got:', event);
    }
  }
  
  handleLastDateChange(date: Date) {
    this.employee.lastDate = date.toISOString().split('T')[0]; // Convert Date to string
  }

  
  async saveEmployee() {
    if (this.employee.id) {
      this.iseditHeader=true;
      await this.employeeService.updateEmployee(this.employee);
    } else {
      await this.employeeService.addEmployee(this.employee);
    }
    await this.employeeService.loadEmployees();  // Refresh list
    this.router.navigate(['/employees']); // Navigate back to list
  }
  cancel() {
    this.router.navigate(['/employees']); // Navigate to employee list on cancel
  }

  openJoiningPicker() {
    this.joiningPicker.open();
  }

  openLastPicker() {
    this.lastPicker.open();
  }
  openDatePicker() {
    const datePicker = document.querySelector('mat-datepicker') as any;
    if (datePicker) {
      datePicker.open();
    }
  }

  onDatePickerOpen() {
    this.isDatePickerOpen = true;
  }

  onDatePickerClose() {
    this.isDatePickerOpen = false;
  }

}


