export class BaseResponseDto {
  constructor(message: string, content?: any) {
    this.message = message;
    this.content = content;
  }

  message: string;

  content: any;
}
