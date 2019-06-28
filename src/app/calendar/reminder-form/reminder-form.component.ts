import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ICity } from 'src/app/shared/model/city.model';
import { BULK_CITIES, DAY_TIME } from 'src/app/shared/constants';
import { IReminder } from 'src/app/shared/model/reminder.model';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent {
  @Input()
  reminder: IReminder;
  @Input()
  showCancelBtn = true;
  @Output()
  saveReminder: EventEmitter<IReminder> = new EventEmitter<IReminder>();
  @Output()
  cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  filteredOptions: Observable<string[]>;
  cities: ICity[] = [...BULK_CITIES];
  dayTime = DAY_TIME;

  constructor() {}

  onAddClick() {
    console.log('before emit: ', this.reminder);
    this.saveReminder.emit(this.reminder);
  }

  onCancel() {
    this.cancel.emit(true);
  }

  onCityChanges(cityChange?: IReminder): void {
    console.log('city change');
    if (cityChange && cityChange.city && cityChange.city.length >= 4) {
      this.filteredOptions = of(cityChange.city).pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities
      .filter(option => option.city.toLowerCase().includes(filterValue))
      .map(c => `${c.city}, ${c.country}`);
  }

}
