import { Component, OnInit, signal, Renderer2, effect } from '@angular/core';
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
  selectedEmployee = signal<Employee>({ id: undefined, name: '', role: '', joiningDate: '', lastDate: '' });

  private startX: number = 0;
  private isDragging: boolean = false;
  private currentSwipeId: number | null = null;


  constructor(public employeeService: EmployeeService, private renderer: Renderer2, private router: Router, private route: ActivatedRoute) {
    effect(() => {
      console.log("Updated Employee List in emp:", this.employeeService.loadEmployees());
    });
  }

  ngOnInit() {
    const employee = this.employeeService.loadEmployees();
    console.log("Updated Employee List in emp1:", employee);
    this.route.paramMap.subscribe(() => {
      this.employeeService.loadEmployees(); 
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id);

  }
  editEmployee(emp: Employee) {
    console.log("Editing Employee:", emp); 
    this.employeeService.navigateToEditEmployee(emp.id!);
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private getListItem(event: MouseEvent | TouchEvent): HTMLElement | null {
    return (event.target as HTMLElement).closest('li');
  }
  onSwipeStart(event: MouseEvent | TouchEvent, id?: number) {
    if (!id) return;  // Ignore if ID is undefined
    this.startX = this.getClientX(event);
    this.isDragging = true;
    this.currentSwipeId = id;
  }
  onSwipeMove(event: MouseEvent | TouchEvent, id: number) {
    if (!this.isDragging || this.currentSwipeId !== id) return;

    const currentX = this.getClientX(event);
    const deltaX = currentX - this.startX;

    if (deltaX < 0) { // Only allow left swiping
      const listItem = this.getListItem(event);
      if (listItem) {
        listItem.style.transform = `translateX(${deltaX}px)`;
      }
    }
  }
  onSwipeEnd(event: MouseEvent | TouchEvent, id: number) {
    if (this.currentSwipeId !== id) return;
    this.isDragging = false;

    const listItem = this.getListItem(event);
    if (listItem) {
      const movedDistance = parseInt(listItem.style.transform.replace(/[^\d.-]/g, ''), 10) || 0;

      if (movedDistance < -100) { // If swiped left past -100px
        this.deleteEmployee(id);
      } else {
        listItem.style.transition = 'transform 0.3s ease-out';
        listItem.style.transform = 'translateX(0)'; // Reset position
      }
    }

    this.currentSwipeId = null;
  }


}





