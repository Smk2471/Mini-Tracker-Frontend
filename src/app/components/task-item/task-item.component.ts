import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  readonly busy = signal(false);

  constructor(private taskService: TaskService) {}

  toggleComplete(): void {
    if (this.busy()) return;
    this.busy.set(true);

    const request =
      this.task.status === 'open'
        ? this.taskService.completeTask(this.task.id)
        : this.taskService.reopenTask(this.task.id);

    request.subscribe({
      next: () => this.busy.set(false),
      error: () => this.busy.set(false)
    });
  }

  deleteTask(): void {
    if (this.busy()) return;
    if (!confirm(`Delete "${this.task.title}"?`)) return;

    this.busy.set(true);
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.busy.set(false),
      error: () => this.busy.set(false)
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
