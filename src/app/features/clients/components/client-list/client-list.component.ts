import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, SimpleChanges } from '@angular/core';
import { Client } from 'src/app/core/models/client.model';
import { MatInputModule } from '@angular/material/input';
import { CustomDatePipe } from 'src/app/shared/pipes/custom.date.pipe';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, CustomDatePipe],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {

  @Input() clients: Client[] = [];

  displayedColumns: string[] = ['name', 'lastName', 'age', 'birthDate'];
  
  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients'] && this.clients) {
      this.dataSource.data = this.clients;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Método para aplicar el filtro de búsqueda.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
