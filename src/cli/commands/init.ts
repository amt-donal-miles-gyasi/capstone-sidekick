import { Command } from 'commander';
import { createAssignmentDirectory, initializeSubmission } from '../utils/init';

const initCommand = (program: Command) => {
  program
    .command('init')
    .description('Initialize a directory as an assignment submission')
    .action(() => {
      try {
        const assignmentPath = createAssignmentDirectory();

        initializeSubmission(assignmentPath);

        process.stdout.write('Assignment submission initialized successfully.');
      } catch (error) {
        process.stdout.write(
          'Failed to initialize assignment submission:',
          error.message
        );
      }
    });
};

export default initCommand;
