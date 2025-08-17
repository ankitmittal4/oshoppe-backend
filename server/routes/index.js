const fs = require('fs');
const path = require('path');

const skip = 'index.js';

const files = fs.readdirSync(__dirname);

module.exports = (app) => {
    files.forEach((file) => {
        if (file !== skip && file.endsWith('.js')) {
            try {
                const routeModule = require(`./${file}`);

                // All routes now export functions that take the app parameter
                if (routeModule.default && typeof routeModule.default === 'function') {
                    routeModule.default(app);
                } else if (typeof routeModule === 'function') {
                    // Direct function export
                    routeModule(app);
                }
            } catch (error) {
                console.error(`Error loading route ${file}:`, error);
            }
        }
    });
};
