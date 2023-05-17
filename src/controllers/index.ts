import fs from 'fs'

const files = fs.readdirSync(__dirname);

const classes: any[] = []

export default async () => {
    for (const file of files) {
        if (file !== 'index.js')
            classes.push((await import('./' + file)).default)
    }
    return classes
}