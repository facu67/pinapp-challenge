import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '-';

    let date: Date;

    // Verificamos si es un Timestamp de Firestore para usar método toDate(), de lo contrario, asumimos que es un string o Date
    if (value && typeof value.toDate === 'function') {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return '-';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
