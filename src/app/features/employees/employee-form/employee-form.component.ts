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


@Component({
  selector: 'app-employee-form',
  imports: [FormsModule,CommonModule, NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,],
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


