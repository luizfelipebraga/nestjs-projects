import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepostory extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<Task> {
    const foundTask = await this.findOneBy({ id })

    if (!foundTask) throw new NotFoundException(`Task ${id} not found`);

    return foundTask;
  }
}