import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppConst } from 'src/app/shared/utils/const';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: ['./slide-menu.component.scss'],
})
export class SlideMenuComponent implements OnInit {
  user: User = {};
  menu: any[] = [];

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    this.getMenuAdmin();
  }

  getMenuAdmin() {
    this.menu = []
  }
}
