import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { search, status } = filterDto;

    let tasks: Task[] = this.getTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => {
        if (task.title.toLowerCase().includes(search) || task.description.includes(search)) {
          return task;
        }
      });
    }

    return tasks;
  }

  getTaskById(taskId: string): Task {
    const getTask = this.tasks.find(task => task.id === taskId);

    if (!getTask) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
    return getTask;
  }

  deleteTaskById(taskId: string): void {
    const getTask = this.getTaskById(taskId);
    this.tasks = this.tasks.filter(task => task.id !== getTask.id);
  }

  updateTaskById(taskId: string, status: TaskStatus) {
    const task = this.getTaskById(taskId);
    task.status = status;
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const tasks = this.getTasks();

    const taskAlreadyExists = tasks.filter((task) => task.title === title);

    if (taskAlreadyExists.length > 0) {
      throw new BadRequestException(`Task with ${title} title already exists`);
    }

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
