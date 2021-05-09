import { Logger } from '@nestjs/common';

export class MyLogger extends Logger {
  error(message: string, trace: string) {
    // write the message to a file, send it to the database or do anything
    super.error(message, trace);
  }
}
