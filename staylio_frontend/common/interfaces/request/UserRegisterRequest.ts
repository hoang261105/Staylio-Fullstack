import { Gender } from "@common/enums";

export interface UserRegisterRequest {
  userName: string;
  fullName: string;
  gender: Gender;
  email: string;
  password: string;
  dateOfBirth: string | null;
}