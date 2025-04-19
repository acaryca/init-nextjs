#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the absolute path of the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to sleep between steps
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to log steps
const logStep = async (stepNumber, message) => {
	console.log(`\n📋 Step ${stepNumber}: ${message}`);
	await sleep(100);
};

// Helper function to find existing file from possible paths
const findExistingFile = (possiblePaths) => {
	return possiblePaths.find(p => fs.existsSync(p));
};

// Main initialization function
async function initProject() {
	try {
		// Step 1: Create the project with create-next-app
		await logStep(1, "Creating the Next.js project");
		execSync('npx create-next-app@latest ./ --javascript --tailwind --app --empty', { stdio: 'inherit' });


		// Step 2: Delete /app directory and its contents
		await logStep(2, "Deleting /app directory and its contents");
		if (fs.existsSync('./app')) {
			fs.readdirSync('./app').forEach(file => {
				fs.unlinkSync(path.join('./app', file));
			});
			fs.rmdirSync('./app');
			console.log('📁 Deleted /app directory and its contents');
		} else {
			console.log('⚠️ /app directory not found, skipping deletion');
		}
		

		// Step 3: Update jsconfig.json
		await logStep(3, "Updating jsconfig.json");
		const jsConfigPath = './jsconfig.json';
		const jsConfigContent = JSON.stringify({
			compilerOptions: {
				paths: {
					"@*": ["./*"]
				}
			}
		}, null, 2);

		fs.writeFileSync(jsConfigPath, jsConfigContent);
		console.log('⚙️ jsconfig.json updated');


		// Step 4: Update next.config.mjs
		await logStep(4, "Updating next.config.mjs");
		const nextConfigPath = './next.config.mjs';
		const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false
};

export default nextConfig;
	`;

		fs.writeFileSync(nextConfigPath, nextConfigContent);
		console.log('⚙️ next.config.mjs updated');


		// Step 5: Update README.md with project name
		await logStep(5, "Updating README.md");
		const packageJsonPath = './package.json';
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				const projectName = packageJson.name || 'Next.js Project';
				fs.writeFileSync('README.md', `# ${projectName}

A website made with Next.js and Tailwind CSS.

![screenshot](/.github/assets/screenshot.png)`);
				console.log('📘 README.md updated with project name');
			} catch (error) {
				console.log('⚠️ Error reading package.json or updating README.md:', error.message);
			}
		} else {
			console.log('⚠️ package.json not found, cannot update README.md');
		}
		
		// Step 6: Update package.json scripts
		await logStep(6, "Adding make-favicon script to package.json");
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				
				// Add make-favicon script to scripts object
				if (!packageJson.scripts) {
					packageJson.scripts = {};
				}
				packageJson.scripts["make-favicon"] = "node dev/icons/make-favicon.js";
				
				// Write updated package.json
				fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
				console.log('⚙️ Added make-favicon script to package.json');
			} catch (error) {
				console.log('⚠️ Error updating package.json:', error.message);
			}
		} else {
			console.log('⚠️ package.json not found, cannot add make-favicon script');
		}
		
		//Step 7: Copy every folder and file from src/ to the root
		await logStep(7, "Copying src/ to the root");
		fs.copySync(path.join(__dirname, 'src'), './');
		console.log('📁 src/ copied to the root');
		
		console.log('\n✅ ACARY Next.js project ready !');
	} catch (error) {
		console.error('❌ An error occurred during initialization:', error.message);
		process.exit(1);
	}
}

// Run the initialization
initProject();
