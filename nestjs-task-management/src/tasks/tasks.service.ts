import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository
  ) { }

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto)
  }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getById(id);
  }

  deleteTaskById(taskId: string): Promise<void> {
    return this.taskRepository.deleteById(taskId);
  }

  updateTaskById(taskId: string, statusDto: UpdateTaskStatusDto): Promise<Task> {
    return this.taskRepository.updateTaskById(taskId, statusDto);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
