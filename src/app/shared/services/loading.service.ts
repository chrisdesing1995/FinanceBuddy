import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingController: LoadingController) { }

  async presentLoading(message?:string, duration?:number, spinner?:any) {
    const loading = Promise.resolve(await this.loadingController.create({
      spinner: spinner,
      message: message,
      duration: duration,
      mode:"ios"
    }));
    await (await loading).present();
  }

  async dismissLoading() {
    const loading = await this.loadingController.getTop();
    if (loading)
        await loading.dismiss(null);
  }
}
