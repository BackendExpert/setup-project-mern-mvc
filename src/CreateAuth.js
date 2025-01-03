#!/usr/bin/env node

const inquirer = require('inquirer');
const { exec } = require('child_process');
const path = require('path')
const currentDir = process.cwd();
const { exit } = require('process');
const argv = require('yargs').argv;
const fs = require('fs-extra');

async function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${error.message}`);
            } else if (stderr) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}