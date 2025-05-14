import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Appointmen2PageRoutingModule } from './appointmen2-routing.module';

// import { Appointmen2Page } from 'src/app/appointmen2.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatAutocompleteServerComponent } from 'src/app/components/mat-autocomplete-server/mat-autocomplete-server.component';
import { Appointmen2Page } from './appointmen2.page';
// import { HighlightSimilarDirective } from '../directives/highlight-similar.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Appointmen2PageRoutingModule, 
    SharedComponentsModule,
    TranslateModule,
    MatTooltipModule,
    MatAutocompleteServerComponent,
  ],
  declarations: [Appointmen2Page]
})
export class Appointmen2PageModule {}
