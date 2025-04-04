# init-nextjs

A tool that sets up a Next.js project with a ready-made folder structure and key files.

## Usage

```bash
npx acary-init-nextjs
```

## Features

- Creates a new Next.js project using `create-next-app`
- Sets up a consistent directory structure (styles, components, public/assets)
- Cleans the public directory
- Creates an empty `.env` file
- Copies a dev directory with utilities
- Creates an empty Icons.js file in components directory  
- Moves `globals.css` to the styles directory and cleans it (keeping only @import lines)
- Configures path aliases in `jsconfig.json`
- Updates the Next.js layout with proper imports
- Manages and adds a custom favicon
- Creates a minimal `next.config.mjs`
- Updates page.js with a minimal component
- Updates the project README.md with the project name
- Adds a make-favicon script to package.json

## Contributing

Feel free to contribute to this project! Don't worry about following strict guidelines or templates. Simply submit your changes and we'll review them. Whether it's a bug fix, feature addition, or documentation improvement, all contributions are welcome.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.txt](LICENSE.txt) file for details.