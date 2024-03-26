import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async presentToast(message?:string,duration?:number,icon?:string,color?:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      icon: icon,
      color:color,
      position: 'bottom',
      mode:"ios"
    });
    toast.present();
  }
}
