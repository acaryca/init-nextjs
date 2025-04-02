#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the absolute path of the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
	// 1. Create the project with create-next-app
	console.log("🛠️ Creating the Next.js project...");
	execSync('npx create-next-app@latest ./', { stdio: 'inherit' });

	// 2. Create the directories if they don't exist
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

	// 3. Delete the content of public except "assets"
	const publicPath = './public';
	if (fs.existsSync(publicPath)) {
		fs.readdirSync(publicPath).forEach(file => {
			if (file !== 'assets') {
				fs.removeSync(path.join(publicPath, file));
				console.log(`🗑️ Deleted: ${file}`);
			}
		});
	}

	// 4. Create an empty .env file
	fs.writeFileSync('.env', '');
	console.log('📝 .env file created');

	// 5. Move globals.css
	const globalsPath = [
		'./app/globals.css',
		'./src/app/globals.css',
		'./src/globals.css',
		'./styles/globals.css',
	].find(p => fs.existsSync(p));

	if (globalsPath) {
		fs.moveSync(globalsPath, './styles/globals.css', { overwrite: true });
		console.log('🎨 File globals.css moved to /styles');
	} else {
		console.log('⚠️ globals.css not found, skipping move operation');
	}

	// 6. Modify jsconfig.json
	const jsConfigPath = './jsconfig.json';
	if (fs.existsSync(jsConfigPath)) {
		fs.writeFileSync(jsConfigPath, JSON.stringify({
			compilerOptions: {
				paths: {
				"@*": ["./*"]
				}
			}
		}, null, 2));
		console.log('⚙️ jsconfig.json updated');
	} else {
		console.log('⚠️ jsconfig.json not found, creating new one');
		fs.writeFileSync(jsConfigPath, JSON.stringify({
			compilerOptions: {
				paths: {
				"@*": ["./*"]
				}
			}
		}, null, 2));
	}

	// 7. Modify layout.js
	const layoutPath = [
		'./app/layout.js',
		'./src/app/layout.js',
	].find(p => fs.existsSync(p));

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

	// 8. Replace favicon.ico
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

	// To copy the custom favicon (put yours in the directory of your script)
	const faviconSource = path.join(__dirname, 'favicon.ico');
	const faviconDest = path.join('public/assets/favicon.ico');
	if (fs.existsSync(faviconSource)) {
		fs.copySync(faviconSource, faviconDest);
		console.log('🖼️ New favicon.ico added');
	} else {
		console.log('⚠️ Custom favicon.ico not found in script directory, skipping');
	}

	// 9. Create next.config.mjs
	const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false
};

export default nextConfig;
	`;
	fs.writeFileSync('next.config.mjs', configContent);
	console.log('⚙️ next.config.mjs created');

	console.log('✅ ACARY Next.js project ready !');
} catch (error) {
	console.error('❌ An error occurred during initialization:', error.message);
	process.exit(1);
}
