import { Component, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { StorageService } from '../../services/storage.service';
import { AppConst } from '../../utils/const';

@Component({
  selector: 'app-popover-action',
  templateUrl: './popover-action.component.html',
  styleUrls: ['./popover-action.component.scss'],
})
export class PopoverActionComponent implements OnInit {
  user: User = new User();
  action: any[] = [];

  constructor(private popover: PopoverController,
    private localStorage:StorageService) {
    
   
  }

  async ngOnInit() {
    this.user = new User();
    this.user = AppConst.currentUser;
    this.action = [
      {
        id: 'V',
        name: 'Label.view',
      },
      {
        id: 'D',
        name: 'Label.delete',
      },
      {
        id: 'D',
        name: 'Label.codeQr',
      },
    ];
    
  }

  onClickAction(event:any) {
    this.popover.dismiss({
      action: event,
    });
  }
}
