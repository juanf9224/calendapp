export interface IReminder {
  id?: number;
  date?: any;
  time?: any;
  color?: string;
  city?: string;
}

export class Reminder implements IReminder {
  constructor(
    public id?: number,
    public date?: any,
    public time?: any,
    public color?: string,
    city?: string
  ) {}
}

