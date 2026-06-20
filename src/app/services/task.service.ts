import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateTaskRequest, StatusFilter, Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  // Central state. Components read via signals; the service owns the source of truth.
  private readonly _tasks = signal<Task[]>([]);
  private readonly _statusFilter = signal<StatusFilter>('all');
  private readonly _searchTerm = signal<string>('');
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly statusFilter = this._statusFilter.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Derived list: applies status filter + search on top of the raw task list.
  readonly filteredTasks = computed(() => {
    const status = this._statusFilter();
    const term = this._searchTerm().trim().toLowerCase();

    return this._tasks().filter((task) => {
      const matchesStatus = status === 'all' ? true : task.status === status;
      const matchesSearch = term === '' ? true : task.title.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  });

  readonly counts = computed(() => {
    const all = this._tasks();
    return {
      all: all.length,
      open: all.filter((t) => t.status === 'open').length,
      completed: all.filter((t) => t.status === 'completed').length
    };
  });

  constructor(private http: HttpClient) {}

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.get<Task[]>(this.baseUrl).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Could not load tasks. Is the API running?');
        this._loading.set(false);
      }
    });
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, request).pipe(
      tap((created) => this._tasks.update((list) => [created, ...list]))
    );
  }

  completeTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/complete`, {}).pipe(
      tap((updated) => {
        this._tasks.update((list) => list.map((t) => (t.id === id ? updated : t)));
      })
    );
  }

  reopenTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/reopen`, {}).pipe(
      tap((updated) => {
        this._tasks.update((list) => list.map((t) => (t.id === id ? updated : t)));
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this._tasks.update((list) => list.filter((t) => t.id !== id)))
    );
  }

  setStatusFilter(filter: StatusFilter): void {
    this._statusFilter.set(filter);
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  clearError(): void {
    this._error.set(null);
  }
}
