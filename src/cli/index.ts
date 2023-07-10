#!/usr/bin/env node

import { program } from 'commander';
import initCommand from './commands/init';
import configCommand from './commands/config';
//import submitCommand from './commands/submit';

program.version('1.0.0');

program
  .command('init')
  .description('Initialize a directory as an assignment submission')
  .action(initCommand);

  program
    .command('config')
    .description('Configure the submission details')
    .option('-i, --interactive', 'Enter details interactively')
    .action(configCommand);

/*     program
      .command('snap')
      .description('Take a snapshot of the assignment')
      .action(snapCommand); */

/* program
  .command('submit <snapshot>') // Request for password
  .description('Submit an assignment')
  .action(submitCommand); */

program.parse(process.argv);
