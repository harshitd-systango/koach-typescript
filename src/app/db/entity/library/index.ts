import { DatabaseConfigurationManager } from '../../DatabaseConfigurationManager'
import configuration from '../../../../resources/config'

let databaseConfigurationManager: DatabaseConfigurationManager = new DatabaseConfigurationManager(configuration.database)

let db: any = databaseConfigurationManager.loadDatabaseModels()
export default db