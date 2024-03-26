import { Injectable } from '@angular/core';
import { AppConst } from '../utils/const';
import { DbKey } from '../utils/dbKey';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { TranslateValueService } from './translateValue.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { DataFireStoreService } from './data-fire-store.service';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {

  constructor(
    private storage: StorageService,
    private toasService: ToastService,
    private _t: TranslateValueService,
    private storageFire: AngularFireStorage,
    private dataService: DataFireStoreService
  ) {}

  validateEmail(email: string): boolean {
    var expretion =
      /^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es|com.ec)+$/;
    if (!expretion.test(email)) {
      this.toasService.presentToast(
        this._t.l('Messages.warningEmail'),
        2000,
        'close-circle',
        AppConst.DangerColor
      );
      return false;
    } else {
      return true;
    }
  }

  getPercentage(task: any): number {
    let completedItems = task.activities.filter(
      (item) => (item.status == true)
    ).length;
    let totalItem = task.activities.length;
    let percentage = (100 / totalItem) * completedItems;

    return parseInt(percentage.toString());
  }

  validateNumber(value: string): string {
    var expretion = '^[0-9]+$';
    if (!value) {
      return '';
    }
    if (value.match(expretion) != null) {
      return value;
    } else {
      this._t.l('Messages.warningNumber'),
        2000,
        'close-circle',
        AppConst.DangerColor;
      return '';
    }
  }

  isNumber(value) {
    return /^-?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?$/.test(value);
  }

  getLanguage(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.storage
        .get(DbKey.languageKey)
        .then((result) => {
          resolve(result as any as string);
        })
        .catch((err) => reject(err));
    });
  }

  getTheme(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.storage
        .get(DbKey.ThemeModeKey)
        .then((result) => {
          resolve(result as any as string);
        })
        .catch((err) => reject(err));
    });
  }

  setLanguage(value: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.storage
        .set(DbKey.languageKey, value)
        .then((result) => {
          resolve(result as any as string);
        })
        .catch((err) => reject(err));
    });
  }

  uploadFile(file: any, path: string, name: string): Promise<string> {
    return new Promise((resolve) => {
      const filePath = path + '/' + name;
      const ref = this.storageFire.ref(filePath);
      const task = ref.put(file);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((res) => {
              let downloadURL = res;
              resolve(downloadURL);
              return;
            });
          })
        )
        .subscribe();
    });
  }
}
