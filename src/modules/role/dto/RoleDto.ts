export class RoleDto {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  readonly id: number;

  readonly name: string;
}
