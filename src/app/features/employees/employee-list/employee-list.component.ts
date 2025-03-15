import { Component, OnInit, signal,Renderer2, effect} from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {
  selectedEmployee = signal<Employee>({ id: undefined, name: '', role: '', joiningDate: '',lastDate:'' });

  constructor(public employeeService: EmployeeService,private renderer: Renderer2,  private router: Router,private route: ActivatedRoute) {
    effect(() => {
      console.log("Updated Employee List in emp:", this.employeeService.loadEmployees());
    });
  }
  
  ngOnInit() {
    const employee=this.employeeService.loadEmployees();
    console.log("Updated Employee List in emp1:", employee);
    this.route.paramMap.subscribe(() => {
      this.employeeService.loadEmployees();  // ✅ Ensure the list reloads when navigating back
    });
  }
  
  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id);
    
  }
  editEmployee(emp: Employee) {
    console.log("Editing Employee:", emp); // ✅ Debugging log
    this.employeeService.navigateToEditEmployee(emp.id!);
  }

  }
  




