import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, FilterBarComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.loadTasks();
  }
}
