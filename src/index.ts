interface IToDoList {
  get tasks(): Task[];
  getTask(id: TaskId): Task | null;
  addTask(name: string, body: string, isRequireEditConfirm?: boolean): void;
  removeTask(id: TaskId): void;
  editTask(id: TaskId, data: { name: string; body: string }): void;
  toogleCompleted(id: TaskId, isConfirmed?: boolean): void;
  getTasksAmount(): number;
  getNotCompletedAmount(): number;
}
interface IToDoListWithSearch extends IToDoList {
  searchTasks(value: string): Task[];
}
interface IToDoListWithSort extends IToDoList {
  sortByIsCompleted(isCompletedFirst: boolean): Task[];
  sortByCreationDate(isAscending: boolean): Task[];
}
type TaskId = typeof Task.idType;

enum TaskType {
  default = 'No confirmation required',
  confirmRequired = 'Confirmation required',
}
interface ITask {
  readonly type: TaskType;
  readonly id: number;
  readonly creationDate: number;
  name: string;
  body: string;
  isCompleted: boolean;
  updateEditDate(): void;
}

class ToDoList implements IToDoList {
  protected _tasks: Task[] = [];

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
  toogleCompleted(id: TaskId, isConfirmed: boolean = false): void {
    const index = this.getTaskIndex(id);
    if (index === -1) {
      console.log('Task not found');
      return;
    }
    if (this._tasks[index].type === TaskType.confirmRequired) {
      if (isConfirmed) {
        this._tasks[index].isCompleted = !this._tasks[index].isCompleted;
      } else {
        console.log("This task require confirm to change it's status");
      }
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
}
class Task implements ITask {
  readonly type: TaskType;
  private static idGenerator: number = 0;
  public static idType: typeof this.idGenerator;

  public readonly id: typeof Task.idType;
  readonly creationDate: number;

  private editDate: number | null = null;

  public name: string;
  public body: string;
  public isCompleted: boolean = false;

  constructor(name: string, body: string, isRequireEditConfirm: boolean = false) {
    this.name = name;
    this.body = body;

    this.type = isRequireEditConfirm ? TaskType.confirmRequired : TaskType.default;
    this.creationDate = Date.now();

    Task.idGenerator += 1;
    this.id = Task.idGenerator;
  }
  updateEditDate(): void {
    this.editDate = Date.now();
  }
}
class ToDoListWithSearch extends ToDoList implements IToDoListWithSearch {
  searchTasks(value: string): Task[] {
    return this._tasks.filter(({ name, body }) => name.includes(value) || body.includes(value));
  }
}

class ToDoListWithSort extends ToDoList implements IToDoListWithSort {
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
