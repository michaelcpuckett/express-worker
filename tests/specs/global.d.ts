import type { ExpressWorker } from '../../src/index';

declare global {
  var GlobalScope: {
    ExpressWorker: typeof ExpressWorker;
  };
}
