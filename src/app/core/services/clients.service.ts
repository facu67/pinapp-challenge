import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { Observable } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientsCollection = collection(this.firestore, 'clientes');

  constructor(private firestore: Firestore) {}

  getClients(): Observable<Client[]> {
    return collectionData(this.clientsCollection, {
      idField: 'id',
    }) as Observable<Client[]>;
  }

  addClient(client: Omit<Client, 'id'>): Promise<any> {
    return addDoc(this.clientsCollection, client);
  }

  /**
   * Calcula el promedio de edad de una lista de clientes.
   * @param clients Lista de clientes activos.
   * @returns Promedio de edad.
   */
  calculateAverageAge(clients: Client[]): number {
    if (!clients || clients.length === 0) return 0;
    const sum = clients.reduce((acc, client) => acc + Number(client.age), 0);
    return Number((sum / clients.length).toFixed(2));
  }

  /**
   * Calcula la desviación estándar poblacional de las edades.
   * @param clients Lista de clientes activos.
   * @param average Promedio de edad previamente calculado.
   * @returns Desviación estándar.
   */
  calculateStandardDeviation(clients: Client[], average: number): number {
    if (!clients || clients.length === 0) return 0;
    const squareDiffs = clients.map((client) => {
      const diff = Number(client.age) - average;
      return diff * diff;
    });
    const avgSquareDiff =
      squareDiffs.reduce((acc, val) => acc + val, 0) / clients.length;
    return Number(Math.sqrt(avgSquareDiff).toFixed(2));
  }
}
