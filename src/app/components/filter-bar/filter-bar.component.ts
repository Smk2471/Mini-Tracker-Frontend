import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { StatusFilter } from '../../models/task.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
  searchInput = '';

  readonly filters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Completed', value: 'completed' }
  ];

  constructor(public taskService: TaskService) {}

  selectFilter(filter: StatusFilter): void {
    this.taskService.setStatusFilter(filter);
  }

  onSearchChange(): void {
    this.taskService.setSearchTerm(this.searchInput);
  }
}
