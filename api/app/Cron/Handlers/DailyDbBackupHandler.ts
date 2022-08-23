import path from 'path'
import { DateTime } from 'luxon'
import { exec } from 'child_process'
import Env from '@ioc:Adonis/Core/Env'
import { existsSync, mkdirSync } from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'

export default class DailyDbBackupHandler {
  private logger: typeof Logger

  constructor() {
    this.logger = Logger
  }

  public run() {
    return new Promise(async (resolve, reject) => {
      try {
        const NOW = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss')

        const DB_CREDENTIALS = {
          db: Env.get('MYSQL_DB_NAME'),
          user: Env.get('MYSQL_USER'),
          password: Env.get('MYSQL_PASSWORD'),
        }

        if (!DB_CREDENTIALS.db || !DB_CREDENTIALS.user) {
          throw new Error('Invalid credentials')
        }

        this.logger.info('DbBackupHandler: DB Backup started at: %s', NOW)

        const fileName = `${DB_CREDENTIALS.db}-${DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss')}.gz`
        const relativeDirName = 'backups'
        const fullDirName = `${path.join(process.cwd(), relativeDirName)}`
        const fullFilePath = `${fullDirName}/${fileName}`

        // Create the backup directory if not exists
        if (!existsSync(relativeDirName)) {
          mkdirSync(relativeDirName)
        }

        exec(
          `mysqldump -u${DB_CREDENTIALS.user} -p${DB_CREDENTIALS.password} --compact ${DB_CREDENTIALS.db} | gzip > ${fullFilePath}`,
          async (error, _stdout, stderr) => {
            if (stderr) {
              this.logger.info('DbBackupHandler: %s', stderr)
            }
            if (error) {
              return reject(error)
            }
            this.logger.info('DbBackupHandler: Local backup created at: %s', NOW)
            this.logger.info('DbBackupHandler: Backup completed at: %s', NOW)
            resolve('done')
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }
}
