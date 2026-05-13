import { Gender } from "@common/enums";

export interface ProfileRequest {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    avatarUrl: string;
    gender: Gender;
}