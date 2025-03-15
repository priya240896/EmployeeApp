import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employee-app';
}
