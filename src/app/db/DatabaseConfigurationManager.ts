import mongoose from "mongoose";
export class DatabaseConfigurationManager {
	db: {} = {}

    modelDirPath: string

    constructor(modelDirPath: string){
        this.modelDirPath = modelDirPath
    }

    loadDatabaseModels(): {} {
        mongoose.connect(this.modelDirPath)
        let db = mongoose.connection
        db.on('error', console.error.bind(console, 'Unable to connect to the database..'))
        db.once('open', function() {
            console.log("DB Connection has been established successfully..");
        })
        this.db = db
        return this.db    
	}
}

/*modelDirPath: string;
    constructor(modelDirPath: string){
        this.modelDirPath = modelDirPath
    }
    loadDatabaseModels(): {} {
        mongoose.connect(this.modelDirPath)
        console.log('Connected')
        return
    }*/