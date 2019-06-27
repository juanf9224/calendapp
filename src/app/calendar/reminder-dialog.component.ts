import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IReminder, Reminder} from '../shared/model/reminder.model';
import * as moment from 'moment';
import {DAY_TIME, BULK_CITIES} from '../shared/constants';
import {ReminderService} from '../shared/service/reminder.service';
import {WeatherService} from '../provider/weather/weather.service';
import { Observable, of } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ICity } from '../shared/model/city.model';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: 'reminder-dialog.component.html'
})
export class ReminderDialogComponent implements OnInit {
  dayTime = DAY_TIME;
  cities: ICity[] = [...BULK_CITIES];
  currentDate = new Date();
  forecast: any;
  filteredOptions: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReminder,
    private reminderService: ReminderService,
    private snackBar: MatSnackBar,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.city) {
      this.weatherService.fetchWeatherForeCast(this.data.city)
        .subscribe(w => this.lookupForecast(w.body.list, this.data.date || moment()));
    } else {
      this.data = new Reminder();
    }
  }

  private lookupForecast(list: any[], date: moment.Moment) {
    this.forecast = list.find(f => this.isSameDate(moment(f.dt_txt), date)).weather[0];
    console.log(this.forecast);
  }

  onCityChanges(): void {
    console.log('city change');
    if (this.data && this.data.city && this.data.city.length >= 4) {
      this.filteredOptions = of(this.data.city).pipe(
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

  onAddClick(reminder: IReminder): void {
    if (reminder && reminder.date) {
      const hours = parseInt(`${reminder.time}`.substring(0, reminder.time.indexOf(':')), 10);
      const minutes = parseInt(`${reminder.time}`.substring(reminder.time.indexOf(':'), reminder.time.length), 10);
      // reminder.date = moment(`${reminder.date}`).add(hours, 'hours').add(minutes, 'minutes');
      const createdReminder = this.createReminder(reminder, hours, minutes);
      console.log(createdReminder.date);
      if (moment(createdReminder.date).isSameOrAfter(moment())) {
        this.reminderService.reminder = createdReminder;
        this.dialogRef.close();
      } else {
        this.handleError(`
          Could not create reminder, date should not be a past date time:
          actual: ${moment()} reminder: ${createdReminder.date}`);
      }
    }
  }

  private createReminder(rem: IReminder, hours: number, minutes: number): IReminder {
    const reminder = Object.assign(new Reminder(), rem);
    reminder.date = moment(rem.date).hours(hours).minutes(minutes);
    return reminder;
  }

  clearReminder(): void {
    this.reminderService.reminder = null;
  }

  private handleError(msg: string, action?: string, waitTime?: number) {
    this.snackBar
      .open(msg,
        action || 'Ok', {duration: waitTime || 4000});
  }

  private isSameDate(a: moment.Moment, b: moment.Moment): boolean {
      return a.month() === b.month() && a.date() === b.date();
  }
}
