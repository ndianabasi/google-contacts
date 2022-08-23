'use strict'

import scheduler from 'node-schedule'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import DailyDbBackupHandler from './Handlers/DailyDbBackupHandler'

/**
 * Runs every 12 hours
 */
scheduler.scheduleJob('0 */12 * * *', async function () {
  const isDbBackupsEnabled = Env.get('ENABLE_DB_BACKUPS')

  if (isDbBackupsEnabled) {
    await new DailyDbBackupHandler()
      .run()
      .catch((error) => Logger.error('DailyDbBackupHandler: %o', error))
  }
})

Logger.info('In-process Cron Jobs Registered!!!')
