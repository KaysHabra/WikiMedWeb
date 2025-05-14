import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-med-form-archives',
  templateUrl: './med-form-archives.component.html',
  styleUrls: ['./med-form-archives.component.scss'],
})
export class MedFormArchivesComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  @Input() Lang = `E`;
  @Input() IsPrinting = false;

  Item: any = {};
  @Input()
  set item(data: any) {
    this.Item = data;

  }

  isModalOpen = false;
  currentIndex = 0;

  images = [
    './assets/imgs/bg1.png',
    './assets/imgs/bg2.png',
    './assets/imgs/test.png',
    './assets/imgs/bg6.png',
    './assets/imgs/bg7.png',
  ];

  openModal(index: number) {
    this.currentIndex = index;
    this.isModalOpen = true;

    setTimeout(() => {
      const swiper: any = document.getElementById('mySwiper');
      swiper.swiper.slideTo(index); // الفهرس يبدأ من 0

      // this.swiperRef?.nativeElement.swiper.slideTo(index);
    }, 500);

  }

  slidesPerView = 1;
  tblCompaire = [];
  CompaireMode = false;

  // swiperRef: ElementRef | undefined;
  constructor() { }

  ngOnInit() { }


  addToReview(img) {
    if (this.tblCompaire.filter(x => x == img).length == 0) {
      
      this.tblCompaire.push(img);
    } else {
      this.removeImg(img)
    }
  }

  chkAddToReview(ev, img){
    console.log(ev.detail.checked);
    if(ev.detail.checked && this.tblCompaire.filter(x=>x == img).length==0){
      this.tblCompaire.push(img);
    }else if(!ev.detail.checked){
      this.removeImg(img)
    }
  }

  removeImg(img) {
    this.tblCompaire = this.tblCompaire.filter(x => x != img);
  }

  isInCompair(img) {
    return this.tblCompaire.filter(x => x == img).length > 0;
  }
}
