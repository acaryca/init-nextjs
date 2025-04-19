# init-nextjs

A tool that sets up a Next.js project with a ready-made folder structure and key files used by ACARY.

## Usage

```bash
npx acary-init-nextjs
```

## Features

- **Project Initialization**: Creates a Next.js project using create-next-app with JavaScript, Tailwind CSS, and App Router
- **Clean Project Structure**: Removes default app directory for a fresh start
- **Path Configuration**: Sets up jsconfig.json with path aliases (@/* imports)
- **Next.js Configuration**: Configures next.config.mjs with optimized settings (disabled dev indicators)
- **README Setup**: Generates a starter README.md with project name and screenshot placeholder
- **Development Utilities**: 
  - Adds make-favicon script to package.json
  - Includes developer tooling from src/ directory
- **Project Files**: Copies all necessary folders and files from the template source to the project root

## Contributing

Feel free to contribute to this project! Don't worry about following strict guidelines or templates. Simply submit your changes and we'll review them. Whether it's a bug fix, feature addition, or documentation improvement, all contributions are welcome.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.txt](LICENSE.txt) file for details.