import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  //   private coffees: Coffee[] = [
  //     {
  //       id: 1,
  //       name: 'Shipwreck Roast',
  //       brand: 'Buddy Brew',
  //       flavors: ['chocolate', 'vanilla'],
  //     },
  //   ];

  //   findAll() {
  //     return this.coffees;
  //   }

  //   findOne(id: string) {
  //     // throw 'A random error';
  //     // this.coffees.find((item) => item.id === parseInt(id));
  //     const item = this.coffees.find((item) => item.id === +id);
  //     if (!item) {
  //       // throw new HttpException(`Coffee #${id} not found!.`, HttpStatus.NOT_FOUND);
  //       throw new NotFoundException(`Coffee #${id} not found!.`);
  //     }
  //     return item;
  //   }

  //   createItem(createCoffeeDto: any) {
  //     this.coffees.push(createCoffeeDto);
  //     return createCoffeeDto;
  //   }

  //   updateItem(id: string, updateCoffeeDto: any) {
  //     const item = this.findOne(id);
  //     // if (item) {
  //     //   return 'update existing item';
  //     // }
  //   }

  //   deleteItem(id: string) {
  //     const itemIndex = this.coffees.findIndex((item) => item.id === +id);
  //     if (itemIndex >= 0) {
  //       this.coffees.splice(itemIndex, 1);
  //     }
  //   }

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,

    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const item = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!item) {
      throw new NotFoundException(`Coffee #${id} not found!.`);
    }
    return item;
  }

  async createItem(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const item = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(item);
  }

  async updateItem(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const item = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!item) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(item);
  }

  async deleteItem(id: string) {
    const item = await this.coffeeRepository.findOneBy({ id: parseInt(id) });
    return this.coffeeRepository.remove(item);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
