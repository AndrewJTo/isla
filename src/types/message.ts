export interface FullName {
  lastName: string;
  firstName: string;
  middleName?: string;
}

export interface Message {
  fullName: FullName;
  dateOfBirth: string;
  primaryCondition: String;
}

export type DBObject<T> = T & {
  id: number;
};
