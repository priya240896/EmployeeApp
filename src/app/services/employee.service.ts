import { computed, effect, Injectable } from '@angular/core';
import { db } from '../core/database/employee-db'; 
import { signal } from '@angular/core';
import { Employee } from '../core/models/employee.model';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class EmployeeService {
  employees = signal<Employee[]>([]);
  constructor(private router: Router) {
    this.loadEmployees();

    // Effect: Log changes to IndexedDB whenever employees change
    effect(() => {
      console.log("Updated Employee List:", this.employees());
      console.log("current",this.currentEmployees());
      console.log("current",this.previousEmployees);
    });
  }

  async loadEmployees() {
    const allEmployees = await db.employees.toArray();
    this.employees.set(allEmployees);
    
  }
  async getEmployeeById(id: number): Promise<Employee | undefined> {
    return await db.employees.get(id);
  }
  
  currentEmployees = computed(() => {
    return this.employees().filter(emp => emp.joiningDate && !emp.lastDate);
  });

  previousEmployees = computed(() => 
    this.employees().filter(emp => emp.joiningDate && emp.lastDate)
  );
  async addEmployee(employee: Employee) {
    await db.employees.add(employee);
    this.loadEmployees();
  }
  async updateEmployee(employee: Employee) {
    if (employee.id) {
      await db.employees.put(employee);
    } else {
      console.error('Employee ID is missing for update.');
    }
    this.loadEmployees();
  }
  async deleteEmployee(id: number) {
    await db.employees.delete(id);
    this.loadEmployees();
  }
  navigateToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }
  navigateToEditEmployee(id: number) {
    this.router.navigate(['/edit-employee', id]);
  }

}