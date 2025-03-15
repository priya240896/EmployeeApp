import Dexie from 'dexie';

export class EmployeeDB extends Dexie {
  employees: Dexie.Table<any, number>;
  constructor() {
    super('EmployeeDB');
    this.version(1).stores({
      employees: '++id, name, role, joiningDate,lastDate'
    });
    this.employees = this.table('employees');
  }
}

export const db = new EmployeeDB();