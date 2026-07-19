export interface Client {
  id?: string;
  name: string;
  lastName: string;
  age: number;
  birthDate: Date | string;
}

export interface ClientsState {
  clients: Client[];
  loading: boolean;
  averageAge: number;
  standardDeviation: number;
  error: string | null;
}