import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = authState(this.auth);

  constructor(private auth: Auth) { }

  /**
   * Inicia sesión con email y contraseña
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Cierra la sesión
   */
  logout() {
    return signOut(this.auth);
  }
}
