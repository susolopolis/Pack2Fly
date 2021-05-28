/**
 * @apiName Modulo encargado de la interaccion con las tablas
 *
 Este modulo realizara las acciones de consulta, eliminacion y adiccion de elementos a las tablas.
 *
 * @Author Jesus Navarro Hernandez
 * @date 23/04/2021
 */
const {sequelize,Personas,Pack, Transporte,Accomodation,Activity } = require('../models')


exports.initiate_table = async () =>{
    await sequelize.sync();
}

//*************************************************************
//*************************************************************
//**************FUNCIONES PARA ELIMINAR************************
//*************************************************************
//*************************************************************

/**
 * @brief Funcion para eliminar un usuario de la tabla
 * @param ID identificador del usuario
 */
exports.erase_user = (ID) =>{
    try {
        Personas.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un pack de la tabla
 * @param ID identificador del pack
 */
exports.erase_pack = (ID) =>{
    try {
        Pack.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un alojamiento de la tabla
 * @param ID identificador del alojamiento
 */
exports.erase_accomodation = (ID) =>{
    try {
        Accomodation.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un transporte de la tabla
 * @param ID identificador del transporte
 */
exports.erase_transport = (ID) =>{
    try {
        Transporte.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un actividad de la tabla
 * @param ID identificador de la actividad
 */
exports.erase_activity = (ID) =>{
    try {
        Activity.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}

//*************************************************************
//*************************************************************
//*************************************************************

exports.log_in = async (Username,Password) =>{
    try{
        const persona = Personas.findAll({
            where: {
                username: Username,
                password: Password
            },
            force:true
        })
    }catch (error){
        console.log(error);
    }
    if(persona != undefined){
        return persona;
    }
}

/**
 * @brief Funcion para crear un usuario (aun con datos de ejemplo)
 */
exports.create_user = async () =>{
    try {
        const persona = Personas.create({
            admin: true,
            email: 'jesuselmister99@gmail.com',
            username: 'Suson99',
            password: 'Jesuselcrack',
            savedPacks: '12,1415,1512',
            puntuation: 9.2,
            profileimage: 'image.jpg',
            lastSeen: new Date(),
            comments: 21
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Devuelve los 10 packs
 */
exports.get_top_packs = async () => {
    const packs = await Pack.findAll();
    let packs_to_return = [];
    let stop = 10;

    for(let i=0;i<stop;i++){
        if(packs[i]!=null) {
            packs_to_return.push(packs[i]);
        }
    }
    return packs_to_return;
}


exports.get_recommended_packs = async () =>{
    const packs = await Pack.findAll();
    let packs_to_return = [];

    let pos = 2
    for(let i=0;i<10;i++){
        if(packs[pos]!=null){
            let is_in=false;
            for(let j=0;j<packs_to_return.length;j++) {
                if (packs_to_return[j].id === packs[pos].id) {
                    is_in = true;
                }
            }
            if(is_in===false){
                packs_to_return.push(packs[pos]);
                pos += 2;
            }
        }
        else{
            if(pos<0){
                pos = 3;
            }
            pos -= 1;
        }
    }
    return packs_to_return;
}
//*************************************************************
//*************************************************************
//**************FUNCION PARA GUARDAR PAQUETE*******************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para guardar en la tabla un pack
 * @param pack pack a guardar
 */
exports.save_pack = async (pack) =>{
    console.log(pack);
    //NO olvidar que cuando guardamos el paquete, tenemos que guardar en el usuario que lo guardo que paquete es.
    var activities='';

    try {
        for (var i = 0; i < pack.places.length; i++) {
            activities += pack.places[i].name;
            if (i < pack.places.length - 1) {
                activities += ',';
            }
        }
        /**
         * Almacenamos la informacion en la tabla con un formato transporte,alojamiento,actividades y precio
         * */
        const pack_to_save = Pack.create({
            transport: "Flight " + pack.flight.Airline + " from " + pack.flight.City_Origin + " to " + pack.flight.City_Destination + " at " + pack.flight.DepartureDate, //Vamos a identificar el vuelo con origen + destino + fecha ida
            accomodation: pack.hotel.name,
            activities: activities,
            price: pack.price
        })

        /**
         * Almacenamos a su vez cada uno de los componentes que componen el pack
         * */

        save_transport(pack.flight)
        save_accomodation(pack.hotel)
        save_activity(pack.places)

        return true;
    }catch (error){
        console.log("ERROR en Modulo_Tablas: " + error);
        return false;
    }
}

//*************************************************************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para guardar en la tabla correspondiente el transporte
 * @param transporte objeto de transporte a guardar
 */
exports.save_transport = async (transporte) =>{
    const transport= Transporte.create({
        minPrice: transporte.minPrice,
        direct: transporte.Direct,
        departure: transporte.DepartureDate,
        airline: transporte.Airline,
        landmarkOrigin: transporte.LandMarkName_Origin,
        landmarkDestination: transporte.LandMarkName_Destination,
        countryOrigin: transporte.Country_Origin,
        countryDestination: transporte.Country_Destination,
        cityOrigin: transporte.City_Origin,
        cityDestination: transporte.City_Destination
    })
}
/**
 * @brief Funcion para guardar en la tabla correspondiente el alojamiento
 * @param transporte objeto de alojamiento a guardar
 */
exports.save_accomodation = async (alojamiento) =>{
    const accomodation= Accomodation.create({
        name: alojamiento.name,
        starRating: alojamiento.Star_rating ,
        address: alojamiento.address,
        guestRating: alojamiento.guest_rating,
        scale: alojamiento.scale,
        currentPrice: alojamiento.current_price
    })
}
/**
 * @brief Funcion para guardar en la tabla correspondiente la actividad
 * @param transporte objeto de actividad a guardar
 */
exports.save_activity = async (actividad) =>{
    const activity = Activity.create({
        name: actividad.name,
        latitude: actividad.latitude,
        lotitude: actividad.longitude

    })
}

async function add_pack_to_user(username,pack){

}
//*************************************************************
//*************************************************************
//**************FUNCIONES PARA MOSTRAR TABLAS******************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para mostrar la tabla de usuarios
 */

exports.show_users = async () => {
    const personas = await Personas.findAll();
    console.log(personas);
}
/**
 * @brief Funcion para mostrar la tabla de packs
 */
exports.show_packs = async () =>{
    const packs = await Pack.findAll();
    console.log(packs);
}
/**
 * @brief Funcion para mostrar la tabla de transporte
 */
exports.show_transport = async () => {
    const transport = await Transporte.findAll();
    console.log(transport);
}
/**
 * @brief Funcion para mostrar la tabla de alojamientos
 */
exports.show_accomodation = async () => {
    const accomodation = await Accomodation.findAll();
    console.log(accomodation);
}
/**
 * @brief Funcion para mostrar la tabla de actividades
 */
exports.show_activity = async () => {
    const activity = await Activity.findAll();
    console.log(activity);
}

//Funcion que devuelve los paquetes en la tabla cuyo destino sea igual al destino introducido
exports.compare_pack_table = async () => {
    const packs_table = await Pack.findAll();
    for (var i=0;i<packs_table.length;i++){
        var transport=packs_table[i].transport;
        var split = transport.split(" ");
        for(var z=0;z<split.length;z++){
            if(split[z]=="from"){
                if(split[z+1]==destiny){
                    packs.push(packs_table[i]);
                }
            }
        }
    }
}
