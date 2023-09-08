import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {

    if (Object.keys(filterDto).length > 0) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getTasks();
    }
  }

  @Get("/:id")
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete("/:id")
  deleteTaskById(@Param('id') id: string): void {
    return this.tasksService.deleteTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch("/:id/status")
  updateTaskById(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
    return this.tasksService.updateTaskById(id, status);
  }
}
