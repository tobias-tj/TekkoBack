export class Parents {
  constructor(
    public readonly parent_id: number,
    public pin_login?: string,
    public email?: string,
    public password?: string,
    public fullName?: string,
  ) {}
}
