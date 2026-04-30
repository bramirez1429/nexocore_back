import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateFinanceRecordDto } from './dto/create-finance-record.dto';
import { UpdateFinanceRecordDto } from './dto/update-finance-record.dto';
import { FinancesService } from './finances.service';

@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post()
  create(@Body() createFinanceRecordDto: CreateFinanceRecordDto) {
    return this.financesService.create(createFinanceRecordDto);
  }

  @Get()
  findAll() {
    return this.financesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinanceRecordDto: UpdateFinanceRecordDto,
  ) {
    return this.financesService.update(id, updateFinanceRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financesService.remove(id);
  }
}
