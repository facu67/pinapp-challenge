import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClientsState } from 'src/app/core/models/client.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientsService } from 'src/app/core/services/clients.service';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { ClientListComponent } from '../components/client-list/client-list.component';
import { ClientFormComponent } from '../components/client-form/client-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ClientListComponent,
    MatDialogModule,
    MatButtonModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.scss'],
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  private state = new BehaviorSubject<ClientsState>({
    clients: [],
    loading: false,
    averageAge: 0,
    standardDeviation: 0,
    error: null,
  });

  state$ = this.state.asObservable();
  private destroy$ = new Subject<void>();

  constructor(
    private clientsService: ClientsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  /**
   * Obtiene la lista de clientes y actualiza el estado local.
   */
  private loadClients(): void {
    this.updateState({ loading: true, error: null });

    this.clientsService
      .getClients()
      .pipe(
        tap((clients) => {
          const averageAge = this.clientsService.calculateAverageAge(clients);
          const standardDeviation =
            this.clientsService.calculateStandardDeviation(clients, averageAge);

          this.updateState({
            clients,
            averageAge,
            standardDeviation,
            loading: false,
          });
        }),
        catchError((error) => {
          console.error('Error fetching clients:', error);
          this.updateState({
            loading: false,
            error: 'Hubo un error al cargar los datos.',
          });
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  /**
   * Actualiza el estado actual combinando los valores anteriores con los nuevos.
   * @param newState Objeto parcial con las propiedades a actualizar.
   */
  private updateState(newState: Partial<ClientsState>): void {
    this.state.next({
      ...this.state.getValue(),
      ...newState,
    });
  }

  openAddClientModal(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateState({ loading: true, error: null });

        this.clientsService
          .addClient(result)
          .then(() => {
            this.notificationService.showSuccess('Cliente guardado con éxito');
            console.log('Cliente guardado con éxito en Firestore');
          })
          .catch((error) => {
            this.notificationService.showError('Ocurrió un error al guardar el cliente. Intentá de nuevo.');
            console.error('Error al guardar el cliente:', error);
            this.updateState({
              loading: false,
              error: 'No se pudo guardar el cliente. Intentá de nuevo.',
            });
          });
      }
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
