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
		execSync('npx create-next-app@latest ./', { stdio: 'inherit' });

		// Step 2: Create required directories
		await logStep(2, "Creating required directories");
		const requiredDirs = [
			'styles',
			'components',
			'public/assets',
		];

		requiredDirs.forEach(dir => {
			if (!fs.existsSync(dir)) {
				fs.mkdirpSync(dir);
				console.log(`📁 Directory created: ${dir}`);
			}
		});

		// Step 3: Clean public directory
		await logStep(3, "Cleaning public directory");
		const publicPath = './public';
		if (fs.existsSync(publicPath)) {
			fs.readdirSync(publicPath).forEach(file => {
				if (file !== 'assets') {
					fs.removeSync(path.join(publicPath, file));
					console.log(`🗑️ Deleted: ${file}`);
				}
			});
		}

		// Step 4: Copy .env file from /src
		await logStep(4, "Copying .env file from src directory");
		const srcEnvPath = path.join(__dirname, 'src', '.env');
		if (fs.existsSync(srcEnvPath)) {
			fs.copySync(srcEnvPath, './.env');
			console.log('📝 .env copied from src directory');
		} else {
			console.log('⚠️ .env not found in src directory, skipping');
		}

		// Step 5: Copy dev directory from script location to project
		await logStep(5, "Copying dev directory");
		const devSourceDir = path.join(__dirname, 'src', 'dev');
		const devDestDir = './dev';
		
		if (fs.existsSync(devSourceDir)) {
			fs.copySync(devSourceDir, devDestDir);
			console.log('📁 dev directory copied to project');
		} else {
			console.log('⚠️ dev directory not found in script location, skipping');
		}

		// Step 6: Create empty Icons.js file in components directory
		await logStep(6, "Creating Icons.js file");
		fs.writeFileSync('./components/Icons.js', '');
		console.log('📝 Empty Icons.js file created in components directory');

		// Step 7: Copying styles directory with globals.css
		await logStep(7, "Copying styles directory");
		
		// Delete any existing globals.css in app directory
		const possibleGlobalsCssPaths = [
			'./app/globals.css',
			'./src/app/globals.css',
		];
		
		possibleGlobalsCssPaths.forEach(p => {
			if (fs.existsSync(p)) {
				fs.removeSync(p);
				console.log(`🗑️ Deleted: ${p}`);
			}
		});
		
		// Copy styles directory from script location to project
		const stylesSourceDir = path.join(__dirname, 'src', 'styles');
		const stylesDestDir = './styles';
		
		if (fs.existsSync(stylesSourceDir)) {
			fs.copySync(stylesSourceDir, stylesDestDir, { overwrite: true });
			console.log('📁 styles directory copied to project');
		}

		// Step 8: Update jsconfig.json
		await logStep(8, "Updating jsconfig.json");
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

		// Step 9: Update layout.js
		await logStep(9, "Updating layout.js");
		const layoutPath = findExistingFile([
			'./app/layout.js',
			'./src/app/layout.js',
		]);

		const layoutContent = `import "@styles/globals.css";

export const metadata = {
	title: "ACARY",
	description: "ACARY",
};

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				{children}
			</body>
		</html>
	);
}
	`;

		if (layoutPath) {
			fs.writeFileSync(layoutPath, layoutContent);
			console.log('🧩 layout.js updated');
		} else {
			console.log('⚠️ layout.js not found, cannot update');
		}

		// Step 10: Copy app directory
		await logStep(10, "Copying app directory");
		const appSourceDir = path.join(__dirname, 'src', 'app');
		
		// Determine destination app directory
		const appDir = './app';
		
		// Create app directory if it doesn't exist
		if (!fs.existsSync(appDir)) {
			fs.mkdirpSync(appDir);
		}
		
		if (fs.existsSync(appSourceDir)) {
			fs.copySync(appSourceDir, appDir, { overwrite: true });
			console.log('📁 app directory copied to project');
		} else {
			console.log('⚠️ app directory not found in script location, skipping');
		}

		// Step 11: Create next.config.mjs
		await logStep(11, "Creating next.config.mjs");
		const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false
};

export default nextConfig;
	`;
		fs.writeFileSync('next.config.mjs', configContent);
		console.log('⚙️ next.config.mjs created');

		// Step 12: Update page.js
		await logStep(12, "Updating page.js");
		const pagePath = findExistingFile([
			'./app/page.js',
			'./src/app/page.js',
		]);

		const pageContent = `import React from 'react'

const page = () => {
    return (
        <div>page</div>
    )
}

export default page
`;

		if (pagePath) {
			fs.writeFileSync(pagePath, pageContent);
			console.log('📄 page.js updated');
		} else {
			console.log('⚠️ page.js not found, cannot update');
		}

		// Step 13: Update README.md with project name
		await logStep(13, "Updating README.md");
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
		
		// Step 14: Update package.json scripts
		await logStep(14, "Adding make-favicon script to package.json");
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
		
		// Step 15: Copy .github directory
		await logStep(15, "Copying .github directory");
		const githubSourceDir = path.join(__dirname, 'src', '.github');
		const githubDestDir = './.github';
		
		if (fs.existsSync(githubSourceDir)) {
			fs.copySync(githubSourceDir, githubDestDir);
			console.log('📁 .github directory copied to project');
		} else {
			console.log('⚠️ .github directory not found in script location, creating empty structure');
			fs.mkdirpSync('./.github/assets');
			console.log('📁 Created empty .github/assets directory structure');
		}
		
		// Step 16: Copy components directory 
		await logStep(16, "Copying components directory");
		const componentsSourceDir = path.join(__dirname, 'src', 'components');
		const componentsDestDir = './components';
		
		if (fs.existsSync(componentsSourceDir)) {
			// Since components might already exist from Step 2, merge instead of overwrite
			fs.copySync(componentsSourceDir, componentsDestDir, { overwrite: true });
			console.log('📁 components directory content copied to project');
		} else {
			console.log('⚠️ components directory not found in script location, skipping');
		}

		// Step 17: Copy middleware.js if it exists
		await logStep(17, "Copying middleware.js");
		const middlewareSourcePath = path.join(__dirname, 'src', 'middleware.js');
		const middlewareDestPath = './middleware.js';
		
		if (fs.existsSync(middlewareSourcePath)) {
			fs.copySync(middlewareSourcePath, middlewareDestPath);
			console.log('📝 middleware.js copied to project');
		} else {
			console.log('⚠️ middleware.js not found in script location, skipping');
		}
		
		console.log('\n✅ ACARY Next.js project ready !');
	} catch (error) {
		console.error('❌ An error occurred during initialization:', error.message);
		process.exit(1);
	}
}

// Run the initialization
initProject();
