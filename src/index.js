#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const client_source = argv.source || path.join(__dirname, 'docs/client');
const client_destination = argv.destination || path.join(process.cwd(), '../');

async function RunSetupProject() {
    try{
        await fs.copy(client_source, client_destination);
        console.log("The Project Setup Successfully...")
    }
    catch(err){
        console.log("Error white setup Project ", err)
    }
}