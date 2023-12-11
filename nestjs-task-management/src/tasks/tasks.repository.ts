import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(): Promise<Task[]> {
    const tasks = await this.find();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN
    })

    await this.save(task);
    return task;
  }

  async getById(id: string): Promise<Task> {
    const found = await this.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    let tasks = await this.getTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task => {
        if (task.title.toLowerCase().includes(search) || task.description.includes(search)) {
          return task;
        }
      })
    }

    return tasks;
  }

  async updateTaskById(taskId: string, statusDto: UpdateTaskStatusDto): Promise<Task> {
    const { status } = statusDto;
    const taskToUpdate = await this.getById(taskId);
    if (!taskToUpdate) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    taskToUpdate.status = status
    await this.save(taskToUpdate)
    return taskToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    const foundTask = await this.getById(id);
    if (foundTask) {
      this.delete(foundTask);
    }
  }
}