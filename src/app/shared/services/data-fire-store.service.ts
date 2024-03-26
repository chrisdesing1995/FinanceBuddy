import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError } from 'rxjs';
import { ResultFirebase } from 'src/app/models/resultFirebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataFireStoreService {
  constructor(public dataBase: AngularFirestore) { }

  createDoc(data: any, path: string, id: string): Promise<ResultFirebase> {
    const collection = this.dataBase.collection(path);
    return collection.doc(id).set(Object.assign({}, data))
      .then(() => {
        console.log('Documento creado exitosamente');
        return { result: true, message: 'Documento creado exitosamente' };
      })
      .catch((error) => {
        console.error('Error al crear el documento:', error);
        return { result: false, message: 'Error al crear el documento: ' + error.message };
      });
  }

  updateDoc(data: any, path: string, id: string): Promise<ResultFirebase> {
    const collection = this.dataBase.collection(path);
    return collection.doc(id).update(Object.assign({}, data))
      .then(() => {
        console.log('Documento actualizado exitosamente');
        return { result: true, message: 'Documento actualizado exitosamente' };
      })
      .catch((error) => {
        console.error('Error al actualizar el documento:', error);
        return { result: false, message: 'Error al actualizar el documento: ' + error.message };
      });
  }

  deleteDoc(path: string, id: string): Promise<ResultFirebase> {
    const collection = this.dataBase.collection(path);
    return collection.doc(id).delete()
      .then(() => {
        console.log('Documento eliminado exitosamente');
        return { result: true, message: 'Documento eliminado exitosamente' };
      })
      .catch((error) => {
        console.error('Error al eliminar el documento:', error);
        return { result: false, message: 'Error al eliminar el documento: ' + error.message };
      });
  }

  getListOrderBy<T>(path: string, orderByField: string, userId: string): Observable<T[]> {
    const collection = this.dataBase.collection<T>(path, ref => ref.where('createUser.id', '==', userId).orderBy(orderByField));
    return collection.valueChanges().pipe(
      catchError(error => {
        console.error('Error fetching ordered list with user filter:', error);
        throw error;
      })
    );;
  }

  getGeneralParameterByCode<T>(path: string, code: string): Observable<T[]> {
    const collection = this.dataBase.collection<T>(path, ref => ref.where('code', '==', code));
    return collection.valueChanges()
      .pipe(
        map(documents => {
          return documents.reduce((acc, cur) => acc.concat(cur['details']), []);
        }),
        catchError(error => {
          console.error('Error fetching details:', error);
          throw error;
        })
      );
  }

  getTransactionByCode<T>(path: string, code: string, userId: string): Observable<T[]> {
    const collection = this.dataBase.collection<T>(path, ref => ref.where('type', '==', code).where('createUser.id', '==', userId));
    return collection.valueChanges().pipe(
      catchError(error => {
        console.error('Error fetching details with user filter:', error);
        throw error;
      })
    );
  }

  getListDoc<T>(path: string, userId: string): Observable<T[]> {
    const collection = this.dataBase.collection<T>(path, ref => ref.where('createUser.id', '==', userId));
    return collection.valueChanges().pipe(
      catchError(error => {
        console.error('Error fetching list with user filter:', error);
        throw error;
      })
    );
  }

  getDocById<T>(path: string, id: string): Observable<T> {
    const collection = this.dataBase.collection<T>(path);
    return collection.doc(id).valueChanges().pipe(
      catchError(error => {
        console.error('Error fetching document by ID:', error);
        throw error;
      })
    );
  }

  toggleDocStatus(data: any, path: string, id: string): Promise<void> {
    const collection = this.dataBase.collection(path);
    data.status = data.status === 'A' ? 'I' : 'A';
    return collection.doc(id).set({ ...data });
  }

  getGenerateId(): string {
    return this.dataBase.createId();
  }

}