import { ApiProperty } from '@nestjs/swagger';

export class DescriptionEntity {
    @ApiProperty()
    description: string;
}
