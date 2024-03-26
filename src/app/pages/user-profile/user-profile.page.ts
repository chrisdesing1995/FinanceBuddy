import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { CameraService } from 'src/app/shared/services/camera.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { ObjectFile } from 'src/app/models/file';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  title: string = '';
  user: User;
  objectFile: ObjectFile;
  lastObjetFile: string;
  newObjetFile: any;
  visibleSegment = true;
  isCustomers: boolean = false;
  dateNow: Date;
  lang: string;
  selectedSegment: string = 'information';

  constructor(
    private cameraService: CameraService,
    private _t: TranslateValueService,
    private storage: StorageService,
    private dataAccess: DataAccessService,
    private dataService: DataFireStoreService,
    private toasService: ToastService,
    private loadingService: LoadingService
  ) {
    this.user = {};
    this.objectFile = new ObjectFile();
    this.dateNow = new Date();
  }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    this.storage.get(DbKey.languageKey).then((lang) => {
      if (!lang) {
        return lang = 'en';
      }
      this.lang = lang;
    });
    this.title = this._t.l('Title.profile');
    this.user = await this.storage.get(DbKey.LOCAL_USER);

  }

  segmentChanged(event: any) {
    const valueSegment = event.detail.value;
    this.selectedSegment = valueSegment;
  }

  onClickCamera() {
    const image = this.cameraService.onCamera();
    image.then(async (x) => {
      this.user.photo = x.dataUrl;
    });
  }

  async onSave() {
    await this.loadingService.presentLoading();

    this.dataService.updateDoc(JSON.parse(JSON.stringify(this.user)), AppConst.DocUsers, this.user.id)
      .then(async () => {
        await this.storage.set(DbKey.LOCAL_USER, this.user).then(() => {
          this.loadingService.dismissLoading();
        });
        this.toasService.presentToast(this._t.l("Messages.succesSave"), 2000, 'checkmark-circle', AppConst.SuccessColor);
        this.loadingService.dismissLoading();
      })
      .catch((err) => {
        this.loadingService.dismissLoading();
      });

  }

}
