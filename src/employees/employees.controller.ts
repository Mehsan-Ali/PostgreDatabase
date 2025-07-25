import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { Employee } from './employees.entity'

@Controller('employees')
export class EmployeesController {
  constructor (private readonly employeesService: EmployeesService) {}

  @Post('create')
  createEmployee (@Body() body: Partial<Employee>): Promise<Employee> {
    return this.employeesService.createEmployee(body)
  }

  @Get()
  findAllData (): Promise<Employee[]> {
    return this.employeesService.findAll()
  }

  @Get(':id')
  findById (@Param('id') id: number): Promise<Employee> {
    return this.employeesService.findOne(id)
  }

  @Put(':id')
  updateEmp (
    @Param('id') id: number,
    @Body() data: Partial<Employee>,
  ): Promise<Employee> {
    return this.employeesService.updateEmployee(id, data)
  }

  @Delete(':id')
  deleteEmp (@Param('id') id: number) {
    return this.employeesService.deleteEmployee(id)
  }
}
