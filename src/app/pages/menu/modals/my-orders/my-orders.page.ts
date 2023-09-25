import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonContent, ModalController, AlertController } from '@ionic/angular'; // On Scrolling and Modal Controller
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";
import { DetailService } from 'src/app/services/details.service';

@Component({
  selector: 'zi-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;

  // My Order
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isOrderOpen: boolean = false;
  isReturnOrderOpen: boolean = false;
  selectData: any = {};
  selectReturnData: any = {};
  statuses = [5, 25, 30, 40]
  isLoading: boolean = false;
  // Return Order
  returnItems: any = [];
  returnPageNumber: number = 1;
  returnPageCount: number = 1;
  returnOrderOpen: boolean = false;
  returnIsLoading: boolean = false;
  returnProducts: any = [];
  note: string = '';
  selectTab: string = 'myOrder';
  deleteLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alertController: AlertController, // Alert Controller
    public icons: IconsService,
    public apiService: ApiService,
    public otherService: OtherService,
    public detailService: DetailService,
  ) { }

  ngOnInit() {
    this.getData();
    this.getReturnData();
  }

  // Get Data
  getData(ev?) {
    this.isLoading = true;
    this.apiService.get(`my-orders/new?page=${this.pageNumber}&lang=${this.otherService.selected}&expand=products`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Get Return Data
  getReturnData(ev?) {
    this.returnIsLoading = true;
    this.apiService.get(`returnal-order/index?page=${this.returnPageNumber}&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.returnItems = res.result;
      this.returnPageNumber += 1;
      this.returnPageCount = res.result._meta.pageCount;
      this.returnIsLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.returnIsLoading = true;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Cancel Order
  cancelOrder() {
    this.translate.get(['cancel', 'orderCancelQuestion', 'yes', 'no']).subscribe(async (res: any) => {
      // Sohw Alert
      const alert = await this.alertController.create({
        header: res.cancel,
        subHeader: res.orderCancelQuestion,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: res.no,
            role: 'cancel',
            cssClass: 'alert-button-black',
          },
          {
            text: res.yes,
            role: 'confirm',
            cssClass: 'alert-button-red',
            handler: () => {
              this.apiService.put(`order/cancel-by-user/${this.selectData.id}`, {}).subscribe(res => {
                this.items = [];
                this.pageNumber = 1;
                this.getData();
                return this.modalCtrl.dismiss(null, 'confirm');
              })
            },
          },
        ],
      });
      await alert.present();
    })
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    this.isLoading = true;
    this.items = [];
    setTimeout(() => {
      this.getData();
    }, 100);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  };
  returnHandleRefresh(event) {
    this.returnPageNumber = 1;
    setTimeout(() => {
      this.returnItems = [];
      this.getReturnData();
    }, 100);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  };

  // On Scrolling
  onIonInfinite(ev) {
    if (this.pageCount >= this.pageNumber) {
      this.getData(ev);
      this.getReturnData(ev);
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }
  returnOnIonInfinite(ev) {
    if (this.returnPageCount >= this.returnPageNumber) {
      this.getReturnData(ev);
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  // Total Products Price for Cash out
  totalPrices(getProducts) {
    return this.otherService.comma(getProducts.toString(), 4)
  }

  // Open Order Modal
  openOrderModal(getItem: any) {
    this.selectData = getItem;
    this.isOrderOpen = true;
    this.getReturnProducts(getItem.id)
  }
  // Close Order Modal
  closeOrderModal() {
    this.isOrderOpen = false;
  }
  // Open Order Product
  openProduct(product) {
    this.isOrderOpen = false;
    product.zi_product_details = [];
    setTimeout(() => {
      this.detailService.openProduct(product)
    }, 100);
  }

  // Get Returnable Products
  getReturnProducts(id) {
    this.isLoading = true;
    this.apiService.get(`returnal-order/get-returns/${id}?lang=${this.otherService.selected}`).subscribe((res: any) => {
      res.result.forEach((product, index) => {
        this.returnProducts[index] = product;
        this.returnProducts[index].max_count = product.count;
      });;
      console.log(res.result, this.returnProducts)
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    })
  }

  // Calc Product Price
  calcPrice(product) {
    if (this.otherService.currency === 'IQD') {
      return product.price
    } else {
      return (product.price / product.exchange_rate).toFixed(2)
    }
  }

  // Calc Total Product Price
  totalPrice(product) {
    if (this.otherService.currency === 'IQD') {
      return product.price * product.count
    } else {
      return ((product.price / product.exchange_rate) * product.count).toFixed(2)
    }
  }

  // Change Count of product Quantity
  changeCount(getProduct: any, opration: string) {
    if (opration === '+') {
      getProduct.count += 1;
      this.returnProducts[this.returnProducts.indexOf(getProduct)] = getProduct
    } else if (getProduct.count > 1) {
      getProduct.count -= 1;
      this.returnProducts[this.returnProducts.indexOf(getProduct)] = getProduct
    }
  }

  // Delete Product
  deleteProduct(product) {
    this.returnProducts.splice(this.returnProducts.indexOf(product), 1)
    if (this.returnProducts.length == 0) {
      this.returnOrderOpen = false;
      setTimeout(() => {
        this.getReturnProducts(this.selectData.id)
      }, 300);
    }
  }

  // Create Returned Products Request
  submitReturnOrder() {
    let data = {
      note: this.note,
      order_id: this.selectData.id,
      item_ids: []
    }
    this.returnProducts.forEach((element: any) => {
      data.item_ids.push({
        item_id: element.item_id,
        quantity: element.count,
      })
    });
    this.isLoading = true;
    this.apiService.post(`returnal-order/create`, data).subscribe((res: any) => {
      this.returnOrderOpen = false;
      this.isOrderOpen = false;
      this.isLoading = true;
      this.items = [];
      this.pageNumber = 1;
      setTimeout(() => {
        this.getData();
      }, 100);
    }, (err) => {
      this.isLoading = false;
    })
  }

  // Open Order Modal
  openReturnOrderModal(getItem: any) {
    this.selectReturnData = getItem;
    this.isReturnOrderOpen = true;
    this.getReturnProducts(getItem.id)
  }

  // Delete Returned Products Request
  deleteReturnedRequest() {
    this.translate.get(['delete', 'deleteReturnedMessage', 'yes', 'no']).subscribe(async (res: any) => {
      // Sohw Alert
      const alert = await this.alertController.create({
        header: res.delete,
        subHeader: res.deleteReturnedMessage,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: res.no,
            role: 'cancel',
            cssClass: 'alert-button-black',
          },
          {
            text: res.yes,
            role: 'confirm',
            cssClass: 'alert-button-red',
            handler: () => {
              this.deleteLoading = true;
              this.apiService.delete(`returnal-order/delete/${this.selectReturnData.id}`).subscribe(res => {
                this.deleteLoading = false;
                this.isReturnOrderOpen = false;
                this.returnItems = [];
                this.getReturnData()
              }, (err) => {
                this.deleteLoading = false;
              })
            },
          },
        ],
      });
      await alert.present();
    })
  }

  // Using for Back to top of Content from Parent Component
  backToTop() {
    this.content.scrollToTop(1500);
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}

