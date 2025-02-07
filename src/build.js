const fs = require('fs')
const path = require('path')
const { minify } = require('html-minifier')
const CleanCSS = require('clean-css')
const UglifyJS = require('uglify-js')


// Function to minify HTML
const minifyHTML = (filePath) => {
    const html = fs.readFileSync(filePath, 'utf8')
    const minified = minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    })

    return minified
}

// Function to minify CSS
const minifyCSS = (filePath) => {
    const css = fs.readFileSync(filePath, 'utf8')
    const output = new CleanCSS().minify(css)
    return output.styles
}

// Function to minify JS
const minifyJS = (filePath) => {
    const js = fs.readFileSync(filePath, 'utf8')
    const result = UglifyJS.minify(js)
    if (result.error) throw result.error
    return result.code
}

// Recursively process files
const processFiles = (dir, distDir, minify) => {

    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file)
        const distPath = path.join(distDir, file)
        const fileName = filePath.split("\\").pop()


        if (fs.statSync(filePath).isDirectory()) {
            if (fileName !== "dist" && fileName !== "node_modules") {
                if (!fs.existsSync(distPath)) {
                    fs.mkdirSync(distPath)
                }

                processFiles(filePath, distPath, ["views", "css", "pages", "js"].includes(fileName))
            }
        } 
        else {
            let minifiedContent = null

            if (minify) {
                if (file.endsWith('.html')) {
                    minifiedContent = minifyHTML(filePath)
                } else if (file.endsWith('.css')) {
                    minifiedContent = minifyCSS(filePath)
                } else if (file.endsWith('.js')) {
                    minifiedContent = minifyJS(filePath)
                } else {
                    minifiedContent = fs.readFileSync(filePath)
                }
            } else {
                minifiedContent = fs.readFileSync(filePath)
            }

            fs.writeFileSync(distPath, minifiedContent)
        }
    })
}


const main = () => {
    // Directories
    const distDir = path.join(__dirname, '../dist')
    const publicDir = path.join(__dirname, '../public')
    const viewsDir = path.join(__dirname, '../src/views')

    // Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir)
    }

    processFiles(publicDir, distDir, true)
    processFiles(viewsDir, distDir, true)
}

main()