import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  title = '';
  description = '';
  priority: TaskPriority = 'medium';

  readonly submitting = signal(false);
  readonly titleError = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);

  constructor(private taskService: TaskService) {}

  onSubmit(): void {
    const trimmedTitle = this.title.trim();

    if (!trimmedTitle) {
      this.titleError.set('Title is required.');
      return;
    }
    this.titleError.set(null);
    this.submitError.set(null);
    this.submitting.set(true);

    this.taskService
      .createTask({
        title: trimmedTitle,
        description: this.description.trim(),
        priority: this.priority
      })
      .subscribe({
        next: () => {
          this.resetForm();
          this.submitting.set(false);
        },
        error: () => {
          this.submitError.set('Failed to create task. Please try again.');
          this.submitting.set(false);
        }
      });
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.priority = 'medium';
  }
}
