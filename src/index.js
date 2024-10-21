#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const client_source = argv.source || path.join(__dirname, 'docs/client');
const client_destination = argv.destination || path.join(process.cwd(), '../');

async function RunSetupProject() {
    try{
        
    }
    catch(err){
        console.log("Error white setup Project ", err)
    }
}