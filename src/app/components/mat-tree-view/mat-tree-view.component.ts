import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AllService } from 'src/app/services/all.service';
// interface FoodNode {
//   NameA: string;
//   children?: any[];
// }


// interface ExampleFlatNode {
//   expandable: boolean;
//   NameA: string;
//   level: number;
// }

@Component({
  selector: 'app-mat-tree-view',
  templateUrl: './mat-tree-view.component.html',
  styleUrls: ['./mat-tree-view.component.scss'],
})
export class MatTreeViewComponent implements OnInit {

  prop = ``;
  @Input()
  set PropVeiw(item: any) {
    this.prop = item;
  }

  // prop2 = ``;
  // @Input()
  // set searchProp2(item: any) {
  //   if (item) this.prop2 = item;
  // }

  @Output()
  btnIcon: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  btnEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() btnDel: EventEmitter<any> = new EventEmitter<any>();

  @Output() btnDetail: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  btnAddSub: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  selectedCAT: EventEmitter<any> = new EventEmitter<any>();

  itms = [];

  @Input()
  set tblArr(item: any) {
    // let t1 = item.slice(0, 47);
    // // alert(JSON.stringify(item[47]) );
    // let t2 = item.slice(50);

    let f1 = this.arrayToTree(item);
    console.log((f1));
    this.dataSource.data = f1;
  }

  tblSelectedCat: any[] = [];
  @Input()
  set tblSelected(item: any) {
    console.log(`tblSelected= `, item);
    this.tblSelectedCat = item;
  }

  MultiSelect = true;
  IsImgDisplay = false;
  IsBtnDel = false;
  IsBtnEdit = false;
  IsBtnAddSub = false;
  IsProgressBar = false;
  IsCheckbox = true;
  IsBtnDetail = false;
  @Input()
  set showDetail(show: any) {
    this.IsBtnDetail = show
  }
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


  // private _transformer = (node: any, level: number) => {
  //   return {
  //     expandable: !!node.children && node.children.length > 0,
  //     NameA: node.NameA,
  //     level: level,
  //   };
  // };

  private _transformer = (node: any, level: number) => {
    return {
      ...node, // نقل جميع خصائص node إلى الكائن الجديد
      expandable: !!node.children && node.children.length > 0, // إضافة خاصية expandable
      level: level, // إضافة خاصية level
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(public all: AllService) {
    // console.log(this.TREE_DATA);
    // this.dataSource.data = this.TREE_DATA;

  }

  hasChild = (_: number, node: any) => node.expandable;

  ngOnInit() { }

  arrayToTree(items: any) {
    for (let itm of items) {
      if (itm.IDF > 0 && items.filter(x => x.IDP == itm.IDF).length == 0) {
        itm.IDF = 0;
      }
    }

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


  getNode(node: any) {
    this.btnDetail.emit(node);
  }

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
    sourceArray.forEach(function (item: any) {
      if (!targetArray.includes(item)) {
        targetArray.push(item);
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

  select(node: any, ev: any) {
    // alert(this.MultiSelect)

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
}
