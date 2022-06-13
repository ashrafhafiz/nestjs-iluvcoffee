import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  // @Get()
  // findAll() {
  //  // return 'This action returns all records';
  //   return this.coffeeService.findAll();
  // }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  // http://localhost:3000/coffees/paginate?limit=20&offset=10
  // @Get('/paginate')
  // findWithPaginate(@Query() paginationQuery) {
  //   const { limit, offset } = paginationQuery;
  //   return `This action returns all records with limit of ${limit} and offset of ${offset}`;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return `This action returns #${id} coffee`;
    return this.coffeeService.findOne(parseInt(id));
  }

  @Post()
  createItem(@Body() createCoffeeDto: CreateCoffeeDto) {
    // return body;
    return this.coffeeService.createItem(createCoffeeDto);
  }

  @Patch(':id')
  modifyItem(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    // return body;
    return this.coffeeService.updateItem(id, updateCoffeeDto);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string) {
    // return `This action removes item #${id}`;
    return this.coffeeService.deleteItem(id);
  }
}
