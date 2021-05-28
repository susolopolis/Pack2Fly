
module_pack=require ('./Module_Pack_Generator')
modulo_transporte=require ('./Module_Trans')
modulo_tablas = require('./Modulo_Tablas')

var mysql = require('mysql');

function create_conection() {
    var conexion = mysql.createConnection({
        host: 'localhost',
        database: 'backend_pack2flydb',
        user: 'root',
        password: null,
    });

    conexion.connect(function (err) {
        if (err) {
            console.error('Error de conexion: ' + err.stack);
            return;
        }
        console.log('Conectado con el identificador ' + conexion.threadId);
    });
}

exports.get_packs = async (origin,destiny,checkin,checkout,people) =>{
    create_conection();
    let packs=await module_pack.main(origin,destiny,checkin,checkout,people);
    return packs;
}

exports.get_recommended = async () => {
    create_conection();
    await modulo_tablas.initiate_table();
    return modulo_tablas.get_recommended_packs();
}

exports.get_top_packs = async () =>{
    create_conection();
    await modulo_tablas.initiate_table();
    return  modulo_tablas.get_top_packs();
}

exports.save_pack = async(pack) => {
    create_conection();
    console.log("Valor de Size "+ pack.size);
    await modulo_tablas.initiate_table();
    let result = await modulo_tablas.save_pack(pack);
    return result;
}
