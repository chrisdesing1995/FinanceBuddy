import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { DbKey } from '../utils/dbKey';

@Injectable({
  providedIn: 'root',
})
export class DataAthenticationService {
  public user$: Observable<any>;
  userSubscription: Subscription | undefined;
  constructor(
    public auth: AngularFireAuth,
    private dataBase: AngularFirestore
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.dataBase
            .doc<User>(`${DbKey.LOCAL_USER}${user.uid}`)
            .valueChanges();
        }
        return of(null);
      })
    );
  }

  async login(email: string, password: string): Promise<any> {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      localStorage.removeItem(DbKey.LOCAL_USER);
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async getUserId() {
    const user = await this.auth.currentUser;
    if (user === null) {
      return null;
    } else {
      return user.uid;
    }
  }

  stateAuth() {
    return this.auth.authState;
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  async registerUser(
    email: string,
    password: string,
    user: any,
    collection: string
  ): Promise<void> {
    try {

      const credential = await this.createUser(email, password);
      const uid = credential.user.uid;

      await this.createUserInFirestore(uid, user, collection);

    } catch (error) {
      // En caso de error, intenta revertir la creación del usuario
      await this.revertUserCreation(email, password);
      this.handleError(error);
    }
  }

  private async createUser(email: string, password: string): Promise<any> {
    try {
      return await this.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  private async createUserInFirestore(uid: string, user: any, collection: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.dataBase.doc(`${collection}${uid}`);
    user.id = uid;
    try {
      await this.dataBase.firestore.runTransaction(async (transaction) => {
        const doc = await transaction.get(userRef.ref);

        if (!doc.exists) {
          transaction.set(userRef.ref, Object.assign({}, user));
        } else {
          throw new Error("El correo electrónico ya está en uso.");
        }
      });
    } catch (error) {
      throw new Error("Error al crear el usuario en Firestore: " + error.message);
    }
  }

  private async revertUserCreation(email: string, password: string): Promise<void> {
    try {
      await (await this.auth.currentUser).delete();
    } catch (error) {
      throw new Error("Error al revertir la creación del usuario: " + error.message);
    }
  }

  private handleError(error: any): void {
    // Mostrar un mensaje de error o realizar otra acción de manejo de errores.
    throw new Error("Error al crear usuario: " + error.message);
  }

}
