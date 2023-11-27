import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepostory } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepostory
  ) { }

  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
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

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskRepository.findOneBy({ id })

    if (!foundTask) throw new NotFoundException(`Task ${id} not found`);

    return foundTask;
  }



  async deleteTaskById(taskId: string): Promise<void> {
    const foundTask = await this.getTaskById(taskId);
    if (foundTask) {
      this.taskRepository.delete(foundTask);
    }
  }

  // updateTaskById(taskId: string, statusDto: UpdateTaskStatusDto) {
  //   const { status } = statusDto;
  //   const task = this.getTaskById(taskId);
  //   task.status = status;
  //   return task;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const tasks = await this.getTasks();

    const taskAlreadyExists = tasks.find(task => task.title === title);

    if (taskAlreadyExists) {
      throw new BadRequestException(`Task with ${title} title already exists`);
    }

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN
    })
    await this.taskRepository.save(task);

    return task;
  }
}
