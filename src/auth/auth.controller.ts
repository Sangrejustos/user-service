import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from 'src/dto/userCredentials.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TokenEntity } from './entities/token.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOkResponse({ type: TokenEntity })
    login(@Body() userCreds: UserCredentialsDto) {
        return this.authService.login(userCreds);
    }

    @Post('registration')
    @ApiOkResponse({ type: TokenEntity })
    registrate(@Body() userDto: UserDto) {
        return this.authService.registrate(userDto);
    }
}
