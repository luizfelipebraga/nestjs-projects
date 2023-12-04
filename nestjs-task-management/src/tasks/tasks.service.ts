import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository
  ) { }

  getTasks(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { search, status } = filterDto;

  //   let tasks: Task[] = this.getTasks();

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task => {
  //       if (task.title.toLowerCase().includes(search) || task.description.includes(search)) {
  //         return task;
  //       }
  //     });
  //   }

  //   return tasks;
  // }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getById(id);
  }

  deleteTaskById(taskId: string): Promise<void> {
    return this.taskRepository.deleteById(taskId);
  }

  updateTaskById(taskId: string, statusDto: UpdateTaskStatusDto): Promise<Task> {
    return this.taskRepository.updateTaskById(taskId, statusDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
