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
const logStep = (stepNumber, message) => {
	console.log(`\n📋 Step ${stepNumber}: ${message}`);
};

// Helper function to find existing file from possible paths
const findExistingFile = (possiblePaths) => {
	return possiblePaths.find(p => fs.existsSync(p));
};

// Main initialization function
async function initProject() {
	try {
		// Step 1: Create the project with create-next-app
		logStep(1, "Creating the Next.js project");
		execSync('npx create-next-app@latest ./', { stdio: 'inherit' });
		await sleep(500);

		// Step 2: Create required directories
		logStep(2, "Creating required directories");
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
		await sleep(500);

		// Step 3: Clean public directory
		logStep(3, "Cleaning public directory");
		const publicPath = './public';
		if (fs.existsSync(publicPath)) {
			fs.readdirSync(publicPath).forEach(file => {
				if (file !== 'assets') {
					fs.removeSync(path.join(publicPath, file));
					console.log(`🗑️ Deleted: ${file}`);
				}
			});
		}
		await sleep(500);

		// Step 4: Create .env file
		logStep(4, "Creating .env file");
		fs.writeFileSync('.env', '');
		console.log('📝 .env file created');
		await sleep(500);

		// Step 5: Handle globals.css
		logStep(5, "Moving and cleaning globals.css");
		const globalsPath = findExistingFile([
			'./app/globals.css',
			'./src/app/globals.css',
			'./src/globals.css',
			'./styles/globals.css',
		]);

		if (globalsPath) {
			// Read the original content
			const originalContent = fs.readFileSync(globalsPath, 'utf8');
			
			// Keep only the lines starting with @import
			const importLines = originalContent.split('\n')
				.filter(line => line.trim().startsWith('@import'))
				.join('\n');
			
			// Create a clean version with only the import lines
			fs.moveSync(globalsPath, './styles/globals.css', { overwrite: true });
			fs.writeFileSync('./styles/globals.css', importLines);
			console.log('🎨 File globals.css moved to /styles and cleaned (only @import lines kept)');
		} else {
			console.log('⚠️ globals.css not found, skipping move operation');
		}
		await sleep(500);

		// Step 6: Update jsconfig.json
		logStep(6, "Updating jsconfig.json");
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
		await sleep(500);

		// Step 7: Update layout.js
		logStep(7, "Updating layout.js");
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
		await sleep(500);

		// Step 8: Handle favicon.ico
		logStep(8, "Managing favicon.ico");
		const possibleFaviconPaths = [
			'./app/favicon.ico',
			'./src/app/favicon.ico',
		];

		possibleFaviconPaths.forEach(p => {
			if (fs.existsSync(p)) {
				fs.removeSync(p);
				console.log(`🗑️ favicon.ico deleted: ${p}`);
			}
		});

		// Copy custom favicon
		const faviconSource = path.join(__dirname, 'favicon.ico');
		const appDir = fs.existsSync('./app') ? './app' : './src/app';
		const faviconDest = path.join(appDir, 'favicon.ico');
		
		if (fs.existsSync(faviconSource)) {
			fs.copySync(faviconSource, faviconDest);
			console.log(`🖼️ New favicon.ico added to ${appDir}`);
		} else {
			console.log('⚠️ Custom favicon.ico not found in script directory, skipping');
		}
		await sleep(500);

		// Step 9: Create next.config.mjs
		logStep(9, "Creating next.config.mjs");
		const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false
};

export default nextConfig;
	`;
		fs.writeFileSync('next.config.mjs', configContent);
		console.log('⚙️ next.config.mjs created');
		await sleep(500);

		// Step 10: Update page.js
		logStep(10, "Updating page.js");
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
		await sleep(500);

		// Step 11: Update README.md with project name
		logStep(11, "Updating README.md");
		const packageJsonPath = './package.json';
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				const projectName = packageJson.name || 'Next.js Project';
				fs.writeFileSync('README.md', `# ${projectName}`);
				console.log('📘 README.md updated with project name');
			} catch (error) {
				console.log('⚠️ Error reading package.json or updating README.md:', error.message);
			}
		} else {
			console.log('⚠️ package.json not found, cannot update README.md');
		}
		
		console.log('\n✅ ACARY Next.js project ready !');
	} catch (error) {
		console.error('❌ An error occurred during initialization:', error.message);
		process.exit(1);
	}
}

// Run the initialization
initProject();
