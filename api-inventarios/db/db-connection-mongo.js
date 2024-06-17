const mongoose = require('mongoose');


const getConnection = async () => {

    try {
        const url = 'mongodb://Mglruiz98:Antoniateamo22@ac-rxlnstg-shard-00-00.pqoxmvw.mongodb.net:27017,ac-rxlnstg-shard-00-01.pqoxmvw.mongodb.net:27017,ac-rxlnstg-shard-00-02.pqoxmvw.mongodb.net:27017/inventarios-2024-28?ssl=true&replicaSet=atlas-6gyaxo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

        await mongoose.connect(url);

        console.log('conexion exitosa');
    } catch (error){
        console.log(error)
    }



}

module.exports = {
    getConnection
}