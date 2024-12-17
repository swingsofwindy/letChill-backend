import { $Enums, Profile, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthResponseDto implements Omit<User, 'createAt' | 'updateAt'> {
    id: number;
    email: string;

    @Exclude()
    password: string;

    role: $Enums.Role;

    @Exclude()
    refreshToken: string;

    profileId: number;
    profile?: Profile;
}
