import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    log(message: string) {
        this.logger.log(message);
    }

    error(err: any) {
        this.logger.error(err);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}
