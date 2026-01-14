import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: import(".prisma/client").$Enums.Role;
            documento: string;
        };
    }>;
}
