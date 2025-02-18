import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { appendFileSync } from 'fs';
import { join } from 'path';

//This Middleware excuted after response finished
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request | any, res: Response, next: Function) {
    res.on('finish', () => {
      const { userId, role } = req.user;
      const line = `[${new Date().toISOString()}] (${req.method }) "${req.url}" BY: {${userId}, <${role}>} STATUS: [${res.statusCode}]`;
      try {
        appendFileSync(join(process.cwd(), "logs.log"), line);
      } catch (error) {
        Logger.error("append data to log.txt file fail!");
      }
      Logger.verbose(line);
    })
    next();
  }
}
