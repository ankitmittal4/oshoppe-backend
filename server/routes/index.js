import fs from 'fs';

const skip = 'index.js';

const files = fs.readdirSync(__dirname);

export default (app) =>
    files.map((file) => file !== skip && require(`./${file}`).default(app));
