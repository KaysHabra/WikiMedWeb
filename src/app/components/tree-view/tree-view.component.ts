import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {

  @Output()
  btnEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  btnDel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  btnAddSub: EventEmitter<any> = new EventEmitter<any>();

  tmpTime = new Date().getTime();
  @Input()
  set timeRefresh(item: any) {
    this.tmpTime = item;
  }

  @Input()
  set tblArr(item: any) {
    let ff = this.arrayToTree(item);
    console.log((ff));
    this.dataSource.data = ff;
  }
  IsBtnDel = false;
  IsBtnEdit = false;
  IsBtnAddSub = false;
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

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  hasChild = (_: number, node: any) => !!node?.children && node?.children.length > 0;
  constructor(public all: AllService) {
    setTimeout(() => {
      console.log(this.dataSource);
    }, 1000);
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

  // export(cmd, node) {
  //   return new Promise(resolve => {
  //     this.change.emit({ Cmd: cmd, Node: node });
  //     // this.childSubmit.emit(item);
  //     // this.endFilter();
  //     resolve(true);
  //   });
  // }

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

}
