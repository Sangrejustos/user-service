import { compare } from 'bcrypt';

export async function comparePassword(
    password: string,
    encrypted: string,
): Promise<boolean> {
    return compare(password, encrypted);
}
