import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('providers')
  list() {
    return this.catalogService.listProviders();
  }

  // ParseUUIDPipe rejects malformed IDs with 400 before they reach the database
  @Get('providers/:id')
  one(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.catalogService.getProvider(id);
  }
}
