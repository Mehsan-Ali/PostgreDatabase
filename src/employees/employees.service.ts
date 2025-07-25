import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Employee } from './employees.entity'
import { Repository } from 'typeorm'

@Injectable()
export class EmployeesService {
  constructor (
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async createEmployee (data: Partial<Employee>): Promise<Employee> {
    const employee = await this.employeesRepository.create(data)
    return this.employeesRepository.save(employee)
  }

  async findAll (): Promise<Employee[]> {
    const employees = await this.employeesRepository.find()
    return employees
  }

  async findOne (id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOneBy({ id })
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`)
    }
    return employee
  }

  async updateEmployee (id:number, data: Partial<Employee>): Promise<Employee> {
    const employee = await this.employeesRepository.findOneBy({ id })
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`)
    }
    const updatedEmployee = Object.assign(employee, data)
    return this.employeesRepository.save(updatedEmployee)
  }

  async deleteEmployee (id:number) : Promise<{ Message: string }> {
    const deleted = await this.employeesRepository.delete(id)
    return { Message: `Employee with ID ${id} deleted successfully ${deleted.affected}` }
  }

  async search(filters: {name?:string , department?:string}) : Promise<Employee[]> {
    const query = this.employeesRepository.createQueryBuilder('employee')

    if (filters.name) {
      query.andWhere('employee.name ILIKE :name', { name: `%${filters.name}%` }) // ILIKE is used for case-insensitive search
    }

    if (filters.department) {
      query.andWhere('employee.department ILIKE :department', { department: `%${filters.department}%` })
    }

    return query.getMany()
  }
}