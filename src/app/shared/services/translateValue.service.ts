import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateValueService {

  constructor(private _translate: TranslateService) { }

  l(value:string):string{
    var data : string = '';
    this._translate.get(value).subscribe(res=>{
        data = res;
    });
    return data;
  }
}
