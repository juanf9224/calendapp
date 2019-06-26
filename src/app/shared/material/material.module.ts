import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatMenuModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatListModule,
  MatInputModule,
  MatToolbarModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatAutocompleteModule
} from '@angular/material';

import { ScrollingModule,
  ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
    imports: [
      MatButtonModule,
      MatMenuModule,
      MatCardModule,
      MatIconModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatGridListModule,
      MatListModule,
      MatInputModule,
      MatToolbarModule,
      MatBadgeModule,
      MatFormFieldModule,
      ScrollingModule,
      ScrollDispatchModule,
      MatSnackBarModule,
      MatDialogModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressBarModule,
      CdkTableModule,
      MatSidenavModule,
      MatAutocompleteModule
    ],
    exports: [
      MatButtonModule,
      MatMenuModule,
      MatCardModule,
      MatIconModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatGridListModule,
      MatListModule,
      MatInputModule,
      MatToolbarModule,
      MatBadgeModule,
      MatFormFieldModule,
      ScrollingModule,
      ScrollDispatchModule,
      MatSnackBarModule,
      MatDialogModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressBarModule,
      CdkTableModule,
      MatSidenavModule,
      MatAutocompleteModule
    ]
})
export class CustomMaterialModule {}
