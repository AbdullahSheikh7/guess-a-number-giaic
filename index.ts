#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradientString from "gradient-string";
import { createSpinner } from "nanospinner";

let retry: boolean = true;
let play: boolean = true;
let tries: number;
let number: number;
let level: [number, number];

const sleep = async (ms: number = 2000) => {
  await new Promise((r) => {
    setTimeout(r, ms);
  });
};

const game = async () => {
  const input: { number: number } = await inquirer.prompt([
    {
      name: "number",
      type: "input",
      message: "Guess a number from 1 to " + level[0] + ": ",
      validate: function (value) {
        if (/[\D]/.test(value) || value < 1 || value > level[0]) {
          return "Enter a valid number";
        } else {
          return true;
        }
      },
    },
  ]);

  const spinner = createSpinner("Checking your guess...");
  spinner.start();

  if (input.number == number) {
    await sleep(500);
    spinner.success({
      text: chalk.greenBright("Congratulations! You guessed it\n"),
    });
    retry = false;
  } else if (input.number > number) {
    await sleep(500);
    tries -= 1;
    if (tries <= 0) {
      spinner.error({
        text: chalk.red(
          "You lose! You left 0 tries. The number was " + number + "\n",
        ),
      });
      retry = false;
      await replay();
      return;
    }
    spinner.error({
      text: chalk.red("Your guess is too big! " + tries + " tries left\n"),
    });
    return;
  } else if (input.number < number) {
    await sleep(500);
    tries -= 1;
    if (tries <= 0) {
      spinner.error({
        text: chalk.red(
          "You lose! You left 0 tries. The number was " + number + "\n",
        ),
      });
      retry = false;
      await replay();
      return;
    }
    spinner.error({
      text: chalk.red("Your guess is too small! " + tries + " tries left\n"),
    });
    return;
  }

  await replay();
};

const replay = async () => {
  const confirm: { restart: boolean } = await inquirer.prompt([
    {
      name: "restart",
      type: "confirm",
      message: "Restart game?",
    },
  ]);

  if (confirm.restart === false) {
    play = false;
  } else {
    return;
  }
};

const main = async () => {
  const askLevel = await inquirer.prompt([
    {
      name: "level",
      type: "list",
      message: "Select a level",
      choices: [
        "Easy - 1 to 100 - 7 tries",
        "Medium - 1 to 500 - 11 tries",
        "Hard - 1 to 1000 - 15 tries",
      ],
    },
  ]);

  if (askLevel.level == "Easy - 1 to 100 - 7 tries") {
    level = [100, 7];
  } else if (askLevel.level == "Medium - 1 to 500 - 11 tries") {
    level = [500, 11];
  } else if (askLevel.level == "Hard - 1 to 1000 - 15 tries") {
    level = [1000, 15];
  }

  tries = level[1];
  number = Math.floor(Math.random() * level[0] + 1);

  console.log(chalk.yellowBright("\nHow to play?"));
  console.log(
    chalk.magenta(`The computer has generated a random number between 1 and ${level[0]} .
You have to guess the number within `) +
      chalk.magenta.bold.italic(tries + " tries. ") +
      chalk.magenta(
        `If you guess the number before the tries get zero, you win, otherwise you lose\n`,
      ),
  );
};

figlet("Guess a Number", (error, data) => {
  console.log(gradientString.pastel.multiline(data));
});
await sleep(100);

let developer = chalkAnimation.rainbow("Made by Abdullah");
await sleep(1000);
developer.stop();

let github = chalkAnimation.neon("github.com/abdullahsheikh7/\n");
await sleep(1000);
github.stop();

do {
  retry = true;
  await main();
  do {
    await game();
  } while (retry);
} while (play);
