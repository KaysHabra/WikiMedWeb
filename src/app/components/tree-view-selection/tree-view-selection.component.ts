import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-tree-view-selection',
  templateUrl: './tree-view-selection.component.html',
  styleUrls: ['./tree-view-selection.component.scss'],
})
export class TreeViewSelectionComponent implements OnInit {
  // tblColorPeriod=[
  //   {5:'#fed33040'},
  //   {10:'#26de8140'},
  //   {15:'#0fb9b140'},
  //   {20:'#45aaf240'},
  //   {25:'#a55eea40'},
  //   {30:'#778ca340'},
  //   {35:'#55E6C140'},
  //   {40:'#3B3B9840'},
  //   {45:'#D6A2E840'},
  //   {50:'#6D214F40'},
  //   {55:'#aaa69d'},
  //   {60:'#47478740'},
  // ];
  tblColorPeriod = {
    5: '#fed33040',
    10: '#26de8140',
    15: '#0fb9b140',
    20: '#45aaf240',
    25: '#a55eea40',
    30: '#778ca340',
    35: '#55E6C140',
    40: '#3B3B9840',
    45: '#D6A2E840',
    50: '#6D214F40',
    55: '#aaa69d',
    60: '#47478740',
  };
  @Input() CheckDoctorSlotPeriod = false;
  prop = ``;
  @Input()
  set PropVeiw(item: any) {
    this.prop = item;
  }

  @Input() IsPatientPoint = false;

  // prop2 = ``;
  // @Input()
  // set searchProp2(item: any) {
  //   if (item) this.prop2 = item;
  // } IsPatientPoint

  @Output() btnControlPanel: EventEmitter<any> = new EventEmitter<any>();
  @Output() btnIcon: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  btnEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  btnDel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  btnAddSub: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  selectedCAT: EventEmitter<any> = new EventEmitter<any>();

  @Input() IsControlPanelButton = false;

  @Input()
  set tblArr(item: any) {
    // if (item[0].ApptSlotsPeriod != undefined) {
    //   item = this.sortJSONArray(item, `ApptSlotsPeriod`);
    //   let ff = this.arrayToTree(item);
    //   console.log((ff));
    //   this.dataSource.data = ff;
    // } else {
    //   let ff = this.arrayToTree(item);
    //   console.log((ff));
    //   this.dataSource.data = ff;
    // }



    let ff = this.arrayToTree(item);
    console.log((ff));
    this.dataSource.data = ff;
  }

  tblSelectedCat: any[] = [];
  @Input()
  set tblSelected(item: any) {
    console.log(`tblSelected= `, item);
    this.tblSelectedCat = item;
  }

  // @Input() IsRadio = false;

  MultiSelect = true;
  IsImgDisplay = false;
  IsBtnDel = false;
  IsBtnEdit = false;
  IsBtnAddSub = false;
  IsProgressBar = false;
  IsCheckbox = true;
  @Input()
  set IsMultiSelect(show: any) {
    this.MultiSelect = show;
  }
  @Input()
  set showCheckbox(show: any) {
    this.IsCheckbox = show
  }

  @Input()
  set showProgressBar(show: any) {
    this.IsProgressBar = show
  }

  @Input()
  set showDelete(show: any) {
    this.IsBtnDel = show
  }
  @Input()
  set showEdit(show: any) {
    this.IsBtnEdit = show
  }
  @Input()
  set showAddSub(show: any) {
    this.IsBtnAddSub = show
  }

  @Input()
  set showImg(show: any) {
    this.IsImgDisplay = show;
  }

  iconSrc = "";

  @Input()
  set fileIcon(key: any) {
    switch (key) {
      case `doctor`:
        this.iconSrc = `./assets/icons/doctor.svg`;
        break;

      default:
        break;
    }
  }

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  hasChild = (_: number, node: any) => !!node?.children && node?.children.length > 0;
  constructor(public all: AllService) {
    setTimeout(() => {
      console.log(this.dataSource);
    }, 1000);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    // this.treeControl.expandAll();
    this.dataSource.data.forEach((node) => this.expandRecursive(node));
    // }, 2000);

  }



  expandRecursive(node: any) {
    this.treeControl.expand(node);
    if (node.children) {
      node.children.forEach((child) => this.expandRecursive(child));
    }
  }

  // handleImageError(event: any) {
  //   event.target.src = 'fallback-image.jpg'; // Set the source of the image to the fallback image
  // }

  imageLoaded(event: any) {
    event.target.src = './assets/imgs/empty-img.png';
  }

  ngOnInit() { }

  delNode(node: any) {
    this.btnDel.emit(node);
  }

  editNode(node: any) {
    this.btnEdit.emit(node);
  }

  addSubNode(node: any) {
    this.btnAddSub.emit(node);
  }

  btnNode(node) {
    this.btnIcon.emit(node);
  }

  btnControl(node){
    this.btnControlPanel.emit(node);
  }

  selectNode() {
    this.selectedCAT.emit(this.tblSelectedCat);
  }

  extractIDs(obj: any) {
    let ids = [obj.IDP]; // Add the current object's ID to the array

    // Recursively iterate over the children
    obj.children.forEach((child: any) => {
      ids = ids.concat(this.extractIDs(child)); // Concatenate the IDs of children
    });

    return ids;
  }

  addUniqueElements(targetArray: any, sourceArray: any) {
    sourceArray.forEach((item: any) => {
      // if(!this.CheckDoctorSlotPeriod){
      //   if (!targetArray.includes(item)) {
      //     targetArray.push(item);
      //   }
      // }else{
      //   if(this.all.tblDoctors.find(x => x.IDP == item) && this.all.tblDoctors.find(x => x.IDP == item).IsDoctor==1){
      //     console.log(item, targetArray );
      //     if (!targetArray.includes(item) && (targetArray.length==0 || this.all.tblDoctors.find(x => x.IDP == item).ApptSlotsPeriod ==  this.all.tblDoctors.find(x => x.IDP == targetArray[0]).ApptSlotsPeriod) ) {
      //       targetArray.push(item);
      //     }
      //   }
      // }



      if (!targetArray.includes(item)) {
        if (!this.CheckDoctorSlotPeriod) {
          targetArray.push(item);
        } else if (this.all.tblDoctors.find(x => x.IDP == item)
          && this.all.tblDoctors.find(x => x.IDP == item).IsDoctor == 1
          && (targetArray.length == 0 || this.all.tblDoctors.find(x => x.IDP == item).ApptSlotsPeriod == this.all.tblDoctors.find(x => x.IDP == targetArray[0]).ApptSlotsPeriod)) {
          targetArray.push(item);
        }
      }



    });
  }
  removeElementsFromArray(targetArray: any, elementsToRemove: any) {
    return targetArray.filter(function (item: any) {
      return !elementsToRemove.includes(item);
    });
  }

  removeAllElements(targetArray: any) {
    targetArray.length = 0; // تصفير المصفوفة
  }

  checkPeriod(node) {
    return this.CheckDoctorSlotPeriod && this.tblSelectedCat.length > 0 && this.all.tblDoctors.find(x => x.IDP == this.tblSelectedCat[0]).ApptSlotsPeriod != node.ApptSlotsPeriod;
  }

  select(node: any, ev: any) {
    // alert(this.MultiSelect)
    // if (node.ApptSlotsPeriod != undefined && this.tblSelectedCat.length > 0 && this.all.tblDoctors.find(x => x.IDP == this.tblSelectedCat[0]).ApptSlotsPeriod != node.ApptSlotsPeriod) {
    //   ev.detail.checked = false;

    // }

    let tmpCat = this.extractIDs(node);
    if (ev.detail.checked) {

      // alert(this.MultiSelect)
      if (this.MultiSelect == false) {

        this.removeAllElements(this.tblSelectedCat);
        // return;
      }

      this.addUniqueElements(this.tblSelectedCat, tmpCat);
    } else {
      this.tblSelectedCat = this.removeElementsFromArray(this.tblSelectedCat, tmpCat);
    }

    console.log(this.tblSelectedCat);
    this.selectNode();
    // this.tblSelectedCat = 
  }

  // export(cmd, node) {
  //   return new Promise(resolve => {
  //     this.change.emit({ Cmd: cmd, Node: node });
  //     // this.childSubmit.emit(item);
  //     // this.endFilter();
  //     resolve(true);
  //   });
  // }

  arrayToTreeyXX(data) {
    const itemMap = {}; // خريطة لتخزين العناصر باستخدام IDP كمفتاح
    const rootItems = []; // مصفوفة لتخزين العناصر الجذرية (التي ليس لها أب)

    // 1. إنشاء خريطة للعناصر
    data.forEach((item) => {
      itemMap[item.IDP] = { ...item, children: [] }; // إضافة children لكل عنصر
    });

    // 2. بناء الشجرة
    data.forEach((item) => {
      if (item.IDF !== 0) {
        // إذا كان للعنصر أب (IDF !== 0)، أضفه كطفل للعنصر الأب
        if (itemMap[item.IDF]) {
          itemMap[item.IDF].children.push(itemMap[item.IDP]);
        }
      } else {
        // إذا كان العنصر جذر (IDF === 0)، أضفه إلى rootItems
        rootItems.push(itemMap[item.IDP]);
      }
    });

    return rootItems; // إرجاع العناصر الجذرية مع أطفالها
  }

  arrayToTree(items: any) {

    const result: any[] = [];
    const itemMap: any = {};
    // First, create a map of items based on their ID
    items.forEach((item: any) => {
      itemMap[item.IDP] = { ...item, children: [] };
    });
    // Second, loop through the items and add them to their parent's children array
    items.forEach((item: any) => {
      if (item.IDF) {
        itemMap[item.IDF].children.push(itemMap[item.IDP]);
      } else {
        result.push(itemMap[item.IDP]);
      }
    });
    return result;
  }


  arrayToTreeXX(items: any) {
    // for (let itm of items) {
    //   if (itm.IDF > 0 && items.filter(x => x.IDP == itm.IDF).length == 0) {
    //     alert(itm.IDF);
    //     itm.IDF = 0;
    //   }
    // }

    const result: any[] = [];
    const itemMap: any = {};

    // First, create a map of items based on their ID
    items.forEach((item: any) => {
      itemMap[item.IDP] = { ...item, children: [] };
    });

    // Second, loop through the items and add them to their parent's children array
    items.forEach((item: any) => {
      if (item.IDF && itemMap[item.IDF]) {
        itemMap[item.IDF].children.push(itemMap[item.IDP]);
      } else if (!item.IDF) {
        result.push(itemMap[item.IDP]);
      }
    });

    return result;
  }

  getNewDoctorPatient(Doctor) {
    let doctor = this.all.deepCopy(Doctor);
    doctor.WeekNewPatients -= doctor.ThreeDaysNewPatients;
    doctor.ThreeDaysNewPatients -= doctor.TodayNewPatients;

    const categories = {
      WeekNewPatients: "bg-blue",  // #10ac84
      ThreeDaysNewPatients: "bg-green",  // #feca57
      TodayNewPatients: "bg-red",  // #ee5253

      // NotAttend: "bg-gray",  // #b2bec3
      // NotAttendAfterConfirm: "bg-black",  // #222f3e
      // BlackPoints: "bg-black",  // #222f3e
      // FutureAppt: "bg-blue"  // #48dbfb
    };

    let iconsHTML = Object.entries(categories)
      .map(([key, className]) =>
        Array(doctor[key]).fill(`<div class="icon-box ${className}"></div>`).join('')
      ).join('');

    return `<div class="new-doctor-patient">
      <div class="row">
        ${iconsHTML}
      </div>
    </div>`;
  }

  sortJSONArray(arr, key, order = 'asc') {
    return arr.sort((a, b) => {
      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
