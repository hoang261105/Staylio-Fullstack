import { UserStatus } from "common/enums/UserStatus";
import { Role } from "./Role";

export interface User{
    id: number;
    email: string;
    status: UserStatus;
    userName: string;
    isEmailVerified: boolean;
    isFirstLogin: boolean;
    passwordHash: string;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    role: Role;
}