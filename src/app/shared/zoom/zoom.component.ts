import { Component, Input, OnInit } from '@angular/core';
import { IconsService } from 'src/app/services/icons.service';
import { ModalController } from '@ionic/angular'; // Modal Controller

@Component({
  selector: 'zi-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements OnInit {

  @Input() img: string;

  constructor(
    public icons: IconsService,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  ngOnInit() {
    
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
