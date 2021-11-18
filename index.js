require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() =>{

    const busquedas = new Busquedas();
    let opt ;//declara Opt options en null
    
    do{
        opt = await inquirerMenu(); 

        switch( opt ) {

            case 1:
                //Mostrar mensaje 
                const termino = await leerInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id === 0 ) continue;
                const lugarSel = lugares.find( l => l.id ===id );
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.name);
                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                console.log(clima);
                //Mostrar resultados
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.name);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                //Usando una coordenada podemos buscar la temperatura: OpenWeathermap
                console.log('Temperatura:', clima.temp);
                console.log('Minima :', clima.min );
                console.log('Maxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green );

            break;
            
            case 2:
                //busquedas.leerDB();
                busquedas.historial.forEach((lugar, i) =>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${ lugar}`);
                })
                
            break;

        }
    
        if( opt !== 0) await pausa();

    }while ( opt !==0 )


}

main();