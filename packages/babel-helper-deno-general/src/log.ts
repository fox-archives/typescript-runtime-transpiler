import path from 'path'
import fs from 'fs'
import util from 'util'

type logSeverity = 'info' | 'warn' | 'error'
/**
 * @desc
 * @argument {string[]} args - extra args to pass to console.log
 * @todo fix so this works as intended
 */
function log(logSeverity: logSeverity, text: string, ...args: any[]): void {
  const babelDenoLogFile = path.join(process.cwd(), '.babel-deno.log')

  let formattedString
  if (args) {
    formattedString = util.format.apply(null, [text, ...args])
  } else {
    formattedString = text
  }

  try {
    fs.appendFileSync(
      babelDenoLogFile,
      `${new Date().toUTCString()}: ${formattedString}\n`
    )
  } catch (err) {
    console.error(err)
    if (err.EEXISTS) {
      fs.writeFileSync(babelDenoLogFile, '')
      log(logSeverity, text, args)
    }
  }
}

export function info(text: string, ...args: any[]): void {
  log('info', text, args)
}

type debugFn = (text: string) => void
export function warn(debug: debugFn, text: string, ...args: any[]): void {
  log('warn', text, args)
  debug(text)
}

export function error(debug: debugFn, text: string, ...args: any[]): void {
  log('error', text, args)
  debug(text)
  console.error.apply(null, [text, ...args])
  throw new Error(text)
}
