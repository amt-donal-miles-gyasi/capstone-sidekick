import { Command } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';

interface Configuration {
  studentId?: string;
  uniqueCode?: string;
}

const configCommand = (program: Command) => {
  program
    .command('config')
    .description('Configure the submission details')
    .option('-i, --interactive', 'Enter details interactively')
    .action(async (options) => {
      if (options.interactive) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'studentId',
            message: 'Enter your student ID:',
          },
          {
            type: 'input',
            name: 'uniqueCode',
            message: 'Enter your uniqueCode:',
          },
        ]);

        const { studentId, uniqueCode } = answers;

        let config: Configuration = {};
        try {
          const configFile = fs.readFileSync('config.json', 'utf-8');
          config = JSON.parse(configFile);
        } catch (error) {
          process.stdout.write('Failed to load the configuration file:', error);
          return;
        }

        config.studentId = studentId;
        config.uniqueCode = uniqueCode;

        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

        process.stdout.write('Configuration saved successfully.');
      } else {
        const studentId = process.argv[3];
        const uniqueCode = process.argv[4];

        if (!studentId || !uniqueCode) {
          process.stdout.write('Student ID and uniqueCode are required.');
          return;
        }

        let config: Configuration = {};
        try {
          const configFile = fs.readFileSync('config.json', 'utf-8');
          config = JSON.parse(configFile) as Configuration;
        } catch (error) {
          process.stdout.write('Failed to load the configuration file:', error);
          return;
        }
        config.studentId = studentId;
        config.uniqueCode = uniqueCode;
        try {
          fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
          process.stdout.write('Configuration saved successfully.');
        } catch (error) {
          process.stdout.write('Failed to save the configuration:', error);
        }
      }
    });
};

export default configCommand;
