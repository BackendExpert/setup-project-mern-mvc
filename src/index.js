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



async function CreateReactViteProject () {
    try{
        const output = await execPromise('npm create vite@latest client -- --template react');
        console.log(`Vite project created successfully: ${output}`);

        await MovetoClientAndInstallNPMs();
        await InstallTailwindCSS();

    }

    catch(err){
        console.log(err)
    }
}

async function DeleteUnnecessaryFilesandFolders (){
    try{
        const packageJsonPath = path.join(currentDir, 'package.json');
        const packageLockJsonPath = path.join(currentDir, 'package-lock.json');
        const nodeModulesPath = path.join(currentDir, 'node_modules');

        if (fs.existsSync(packageJsonPath)) {
            fs.unlinkSync(packageJsonPath)
        }
        if (fs.existsSync(packageLockJsonPath)) {
            fs.unlinkSync(packageLockJsonPath)
        }
        if (fs.existsSync(nodeModulesPath)) {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            console.log(`Folder deleted: ${nodeModulesPath}`);    
        }
    }
    catch(err){
        console.log(err)
    }
}

async function MovetoClientAndInstallNPMs() {
    try {
        const clientDir = path.join(currentDir, 'client');

        if (fs.existsSync(clientDir)) {
            process.chdir(clientDir); 
            console.log(`Changed working directory to: ${process.cwd()}`);

            const output = await execPromise('npm install');
            console.log(`NPM packages installed in client directory: ${output}`);
        } else {
            console.error(`Client directory not found: ${clientDir}`);
        }
    } catch (err) {
        console.error(`Error during changing directory or installing NPM packages: ${err.message}`);
    }
}

async function InstallTailwindCSS () {
    try{
        const tailwindInstall = await execPromise('npm install -D tailwindcss postcss autoprefixer');
        const tailwindcssInit = await execPromise('npx tailwindcss init -p');

        const client_tailwind_index_source = argv.source || path.join(__dirname, '../docs/index.css');
        const client_tailwind_index_destination = argv.destination || path.join(process.cwd(), './src');   

        const client_tailwind_config_source = argv.source || path.join(__dirname, '../docs/tailwind.config.js');
        const client_tailwind_config_destination = argv.destination || path.join(process.cwd(), './');  

        const client_AppJSX_source = argv.source || path.join(__dirname, '../docs/App.jsx');
        const client_AppJSX_destination = argv.destination || path.join(process.cwd(), './src');  

        if (fs.existsSync(client_tailwind_index_source)) {
            await fs.promises.copyFile(client_tailwind_index_source, path.join(client_tailwind_index_destination, 'index.css'));
            await fs.promises.copyFile(client_tailwind_config_source, path.join(client_tailwind_config_destination, 'tailwind.config.js'));
            await fs.promises.copyFile(client_AppJSX_source, path.join(client_AppJSX_destination, 'App.jsx'));
            console.log(`Tailwind CSS installed and Initialized successfully.`);
            console.log(`Changing Current Working Directory to Root Directory...`);


        } else {
            console.error(`Source CSS file does not exist: ${client_tailwind_index_source}`);
        }
    }
    catch(err){
        console.log(err)
    }
}

async function CreateServerNodeJs() {
    try {
        const serverDir = path.join(currentDir, 'server');

        if (!fs.existsSync(serverDir)) {
            fs.mkdirSync(serverDir, { recursive: true }); 
            console.log(`Server directory created: ${serverDir}`);
        }

        process.chdir(serverDir); 
        console.log(`Changed working directory to: ${process.cwd()}`);

        await execPromise('npm init -y');

        const server_packageJson_source = argv.source || path.join(__dirname, '../docs/package.json');
        const server_packageJson_destination = argv.destination || path.join(process.cwd(), './');  

        if (fs.existsSync(server_packageJson_source)) {
            await fs.promises.copyFile(server_packageJson_source, path.join(server_packageJson_destination, 'package.json'));
            

            console.log(`Server Initialized successfully.`);

            const server_index_source = argv.source || path.join(__dirname, '../docs/server.js');
            const server_index_destination = argv.destination || path.join(process.cwd(), './');  

            const server_env_source = argv.source || path.join(__dirname, '../docs/.env');
            const server_env_destination = argv.destination || path.join(process.cwd(), './');  


            if (fs.existsSync(server_index_source)) {
                await fs.promises.copyFile(server_index_source, path.join(server_index_destination, 'server.js')); 
                console.log(`Server file Initialized successfully.`);

                await fs.promises.copyFile(server_env_source, path.join(server_env_destination, '.env')); 
                console.log(`ENV file of Server Initialized successfully.`);

                const dbContent = `
const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");
    } catch (err) {
        console.log(err);
        process.exit(1); // Exit process with failure
    }
};
module.exports = ConnectDB;
                `;

                const configDir = `./config`;
                fs.ensureDirSync(configDir);
                fs.writeFileSync(`${configDir}/db.js`, dbContent);
                console.log(`Database Config file Created Successful`);

                const rootDir = path.join(currentDir, './');
                process.chdir(rootDir);

                console.log(`Changed Current Working Directory to Root Directory Successfully: ${process.cwd()}`);
                console.log(`Deleting Unnecessary Files and Folders from Root Directory...`);

                await DeleteUnnecessaryFilesandFolders();

                console.log(`Root Directory Clear Successful...!`);
                console.log(`Now you can continue... to create Models Controllers and Routes please use : https://www.npmjs.com/package/automate-backend-fullstack`);
            } else {
                console.log("Source file cannot be found");
            }

        } else {
            console.log("Source file not found");
        }

    } catch (err) {
        console.log(err);
    }
}

async function NoFunc() {
    console.log("Under Development")
}

async function main() {
    try{
        const answers = await inquirer.prompt([
            {
              type: 'list',
              name: 'createClientServer',
              message: 'Create Client and Server in Same Folder(Repo) :',
              choices: ['Yes', 'No'],
            },
        ]);   

        const { createClientServer } = answers;
        
        switch(createClientServer){
            case 'Yes':
                await CreateReactViteProject()
                await CreateServerNodeJs()
                exit;
                break
            
            case 'No':
                await NoFunc()
                exit;
                break

            default:
                console.log('Invalid selection.');
        }
    }
    catch(err){
        console.log(err)
    }
}

main()