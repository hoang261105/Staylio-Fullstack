import { RoleName } from "@common/enums/RoleName";
import { UserStatus } from "@common/enums/UserStatus";

export interface UserResponse {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    phone: string;
    dateOfBirth: string;
    roleName: RoleName;
    status: UserStatus
}

