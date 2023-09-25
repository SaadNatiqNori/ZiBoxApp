import { Component, OnInit } from '@angular/core';
import { StartupService } from "src/app/services/startup.service";
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'zi-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  items: any = [];
  isNotificationOpen: boolean = false;

  constructor(
    private startupService: StartupService,
    private storage: Storage,
  ) {
    storage.get('notifications').then((value) => {
      this.items = value
    }).catch(_ => {
      this.items = [];
    })
  }

  ngOnInit() {
    this.startupService.getMyNotifications();
  }

  // Notification
  selectedNotification: any = {};
  openDetailModal(getItem: any) {
    this.selectedNotification = getItem
    this.isNotificationOpen = true;
  }
  // Close Notification Modal
  closeNotificationModal() {
    this.isNotificationOpen = false;
  }

}
