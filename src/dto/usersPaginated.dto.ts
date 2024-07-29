import { User } from '@prisma/client';

export class UsersPaginated {
    users: User[];
    page: number;
    pagesAmount: number;
}
