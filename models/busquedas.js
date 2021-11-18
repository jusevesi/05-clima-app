const fs = require('fs');

const axios = require('axios');
const { listarLugares } = require('../helpers/inquirer');

class Busquedas{
    historial = [];
    dbPath='./db/database.json';

    constructor() {
        //Todo: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );            
            return palabras.join(' ');
        })
    }


    get paramsMapbox(){
        return {
            //normalmente las variables de entorno no se suben a GitHub, solo se indica el example.env con las variables requeridas
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsOpenWeather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }   

   }

    async ciudad( lugar = '' ){

        try {
            //peticion http
            const intance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params:this.paramsMapbox
            });

            const resp = await intance.get();
            //retornar los lugares que coinciden con la busquedad
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                name: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            //reventar la aplicacion, poner "throw"
            console.log(error);
            return[];
        }
    }

    async climaLugar (lat, lon){
        try{
            //peticion http
            const intance = axios.create({
                baseURL:'https://api.openweathermap.org/data/2.5/weather',
                params:{...this.paramsOpenWeather, lat, lon},
            });

            // const {data} = await intance.get()
            const resp = await intance.get();
            //Desestructurar de la data el weather y el main
            const {weather, main} = resp.data
            

            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        }catch(error){
            console.log(error);
        }
    }

    agregarHistorial (lugar = ''){
        //TODO: Prevenir duplicados
        if( this.historial.includes(lugar.toLocaleLowerCase())){
            return
        }
        this.historial = this.historial.splice(0,5);
        
        this.historial.unshift( lugar );
        //Guardar en DB
        this.guardarDB();
    }

    guardarDB (){

        const payload ={
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    leerDB (){

        if(!fs.existsSync(this.dbPath)){
            console.log('No hay historial');
            return null
        }
        //fs readFile   encoding para que no devuelva los bites
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse (info);
        this.historial = data.historial;

        // data.historial.forEach( (lugar, i ) => {
        //     const lugarUpper = lugar.charAt(0).toUpperCase() +lugar.slice(1);
        //     const idx = `${i + 1}.`.green;
        //     console.log(`${idx} ${ lugarUpper }`);
        // })

        return data;
        
    }
}


module.exports = Busquedas;