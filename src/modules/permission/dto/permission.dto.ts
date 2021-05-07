export class PermissionDto {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  readonly id: string;

  readonly name: string;
}
