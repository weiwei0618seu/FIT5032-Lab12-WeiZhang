import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const reportDirectory = dirname(fileURLToPath(import.meta.url))
const reportPath = join(reportDirectory, 'lab5_report.tex')
const report = readFileSync(reportPath, 'utf8')

const expectedScreenshots = [
  ...new Set([...report.matchAll(/\{(lab5_[^{}]+\.png)\}/g)].map((match) => match[1])),
].sort()

const missingScreenshots = expectedScreenshots.filter(
  (filename) => !existsSync(join(reportDirectory, filename)),
)

console.log(`Expected screenshots: ${expectedScreenshots.length}`)
console.log(`Present screenshots: ${expectedScreenshots.length - missingScreenshots.length}`)
console.log(`Missing screenshots: ${missingScreenshots.length}`)

if (missingScreenshots.length > 0) {
  console.log('\nMissing files:')
  for (const filename of missingScreenshots) console.log(`- ${filename}`)
  process.exitCode = 1
} else {
  console.log('\nAll screenshot filenames match the LaTeX report.')
}

const logoFilename = 'monash-university-vector-logo.png'
if (!existsSync(join(reportDirectory, logoFilename))) {
  console.log(`\nCover logo not found: ${logoFilename}`)
}
