import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: 'OPEN' });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const taskAlreadyCreated = await this.findOneBy({ title })

    if (taskAlreadyCreated) throw new ConflictException(`Task ${title} already exists`);

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
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
    const result = await this.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}