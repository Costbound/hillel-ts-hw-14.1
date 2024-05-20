interface IToDoList {
  get tasks(): Task[];
  getTask(id: TaskId): Task | null;
  addTask(name: string, body: string, isRequireEditConfirm?: boolean): void;
  removeTask(id: TaskId): void;
  editTask(id: TaskId, data: { name: string; body: string }): void;
  toogleCompleted(id: TaskId): void;
  getTasksAmount(): number;
  getNotCompletedAmount(): number;
  searchTasks(value: string): Task[];
  sortByIsCompleted(isCompletedFirst: boolean): Task[];
  sortByCreationDate(isAscending: boolean): Task[];
}
type TaskId = typeof Task.idType;

interface ITask {
  readonly id: number;
  readonly creationDate: number;
  name: string;
  body: string;
  isCompleted: boolean;
  updateEditDate(): void;
}

class ToDoList implements IToDoList {
  private _tasks: Task[] = [];

  get tasks(): Task[] {
    return this._tasks;
  }
  private getTaskIndex(id: TaskId): number {
    return this.tasks.findIndex(task => task.id === id);
  }
  getTask(id: TaskId): Task | null {
    const index = this.getTaskIndex(id);
    return index === -1 ? null : this.tasks[index];
  }
  addTask(name: string, body: string, isRequireEditConfirm?: boolean): void {
    this._tasks.push(new Task(name, body, isRequireEditConfirm));
  }
  removeTask(id: TaskId): void {
    const index = this.getTaskIndex(id);
    if (index === -1) {
      return;
    }
    this._tasks.splice(index, 1);
  }
  editTask(id: TaskId, data: { name: string; body: string }): void {
    const index = this.getTaskIndex(id);
    if (index === -1) {
      return;
    } else {
      const task = this._tasks[index];
      task.name = data.name;
      task.body = data.body;
      task.updateEditDate();
    }
  }
  toogleCompleted(id: TaskId): void {
    const index = this.getTaskIndex(id);
    if (index === -1) {
      return;
    } else {
      this._tasks[index].isCompleted = !this._tasks[index].isCompleted;
    }
  }
  getTasksAmount(): number {
    return this._tasks.length;
  }
  getNotCompletedAmount(): number {
    return this._tasks.filter(({ isCompleted }) => !isCompleted).length;
  }

  searchTasks(value: string): Task[] {
    return this._tasks.filter(({ name, body }) => name.includes(value) || body.includes(value));
  }
  sortByIsCompleted(isCompletedFirst?: boolean): Task[] {
    const completed = this._tasks.filter(({ isCompleted }) => isCompleted);
    const notCompleted = this._tasks.filter(({ isCompleted }) => !isCompleted);
    return isCompletedFirst ? [...completed, ...notCompleted] : [...notCompleted, ...completed];
  }
  sortByCreationDate(isAscending?: boolean): Task[] {
    return isAscending
      ? this._tasks.toSorted((a, b) => a.creationDate - b.creationDate)
      : this._tasks.toSorted((a, b) => b.creationDate - a.creationDate);
  }
}
class Task implements ITask {
  private static idGenerator: number = 0;
  public static idType: typeof this.idGenerator;

  public readonly id: typeof Task.idType;
  readonly creationDate: number;
  readonly isRequireEditConfirm: boolean;

  private editDate: number | null = null;

  public name: string;
  public body: string;
  public isCompleted: boolean = false;

  constructor(name: string, body: string, isRequireEditConfirm: boolean = false) {
    this.name = name;
    this.body = body;

    this.isRequireEditConfirm = isRequireEditConfirm;
    this.creationDate = Date.now();

    Task.idGenerator += 1;
    this.id = Task.idGenerator;
  }
  updateEditDate(): void {
    this.editDate = Date.now();
  }
}
