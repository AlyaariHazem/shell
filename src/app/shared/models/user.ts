import { Status } from "@app/enums";

export interface IUser {
  id: number;
  name: string;
  email: string;
  status: Status;
}
