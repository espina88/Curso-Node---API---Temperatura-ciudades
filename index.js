import 'colors';
import 'dotenv/config';


import { inquirerMenu, pausa, leerInput,listarLugares } from './helpers/inquirer.js';
import Busquedas from './models/busquedas.js';



const main = async() => {

    let opc = '';
    const busquedas = new Busquedas();

    do{
        opc =  await inquirerMenu();

        switch ( opc ){
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad a buscar: ');
                const lugares = await busquedas.ciudad(termino);
                const id = await listarLugares( lugares );
                if( id===0 ) continue
                
                const lugarSel = lugares.find( l => l.id === id );
                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );

                console.log(lugarSel);

                //Openweather
                const tmp = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

                // console.clear();
                console.log('\nInformación de la ciudad \n'.green);
                console.log('Ciudad', lugarSel.nombre );
                console.log('Lat', lugarSel.lat );
                console.log('Long', lugarSel.lng);
                console.log('Como está el clima:', tmp.desc );
                console.log('Temperatura Mínima:', tmp.min);
                console.log('Temperatura Máxima:', tmp.max);
                console.log('Temperatura:', tmp.temp);
                break;

            case 2:
                busquedas.historial.forEach( (lugar,i) =>{
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }`);
                });

                break;
        }
        if(opc !==0) await pausa();

    }while(opc!==0);

}


main();

