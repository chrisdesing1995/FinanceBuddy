import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private storage: StorageService) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.storage.get(DbKey.HAS_LOGGED_IN).then((res)=>{
      if (res) {
        this.router.navigateByUrl(AppConst.Home);
        return false;
      }else{
        return true;
      }
    });  
  }
}