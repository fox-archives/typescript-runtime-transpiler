import path from 'path'
import fs from 'fs'

type logSeverity = 'info' | 'warn' | 'error'
function log(logSeverity: logSeverity, text: string): void {
  const babelDenoLogFile = path.join(process.cwd(), '.babel-deno.log')

  try {
    fs.appendFileSync(
      babelDenoLogFile,
      `${new Date().toUTCString()}: ${text}\n`
    )
  } catch (err) {
    console.error(err)
    if (err.EEXISTS) {
      fs.writeFileSync(babelDenoLogFile, '')
      log(logSeverity, text)
    }
  }
}

export function info(text: string) {
  return log('info', text)
}

export function warn(text: string, debug: Function) {
  debug(text)
  return log('warn', text)
}

export function error(text: string, debug: Function) {
  debug(text)
  return log('error', text)
}
