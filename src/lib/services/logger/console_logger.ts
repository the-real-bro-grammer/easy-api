import { ILogger } from './i_logger';

export class ConsoleLogger implements ILogger {
    public logErrorMessage(message: string) {
        console.log(`ERROR ${message}`);
    }
}
