import {Injectable} from '@angular/core';
import {IReminder} from '../model/reminder.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  reminder: IReminder;
  constructor() {}
}
