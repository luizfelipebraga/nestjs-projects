import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTaskById(taskId: string): Task {
    return this.tasks.find(task => task.id === taskId);
  }

  deleteTaskById(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const newTask: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(newTask);
    return newTask;
  }
}
