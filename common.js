var config = require('./config')

module.exports = class Common{
    constructor(){
        this.name="RSP";
        this.db=config.db;
    }

    async fetch_incidents(){
        var results=await this.db.incidents.find({});
        results.forEach(function(result)  {
            console.log(result);
        });

        return results
        //return await this.db.incidents.find({});
        // await this.db.incidents.find({}), async function (err,results){
        //     if (err){
        //         console.log(err);
        //     }else{
        //         return await results;
        //     }
        // }
    }

    async fetch_emergencies(){
        await this.db.emergencies.find({}), function (err,results){
            if (err){
                console.log(err);
            }else{
                console.log(results);
                return results;
            }
        }
    }

}


