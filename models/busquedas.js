
import fs from 'fs';

import axios from 'axios';


class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){

        this.leerDB();

    }

    get paramsMapbox(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsOpenWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '' ){
        
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        }catch(error){
            return [];
        }
         

        return []; // Retornar los lugares que coincidan 
    }

    async climaLugar(lat,lon){
        try {
            //Instancia axios
            const in2 = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });
            const resp2 = await in2.get();
            const { weather,main } = resp2.data;

            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    agregarHistorial( lugar = '' ){
        
        if( this.historial.includes( lugar.toLocaleLowerCase() )){
            return
        }

        this.historial.unshift(lugar);
        //Grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerDB(){
 
        if(!fs.existsSync( this.dbPath )){ 
            return;
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const infopar = JSON.parse(info);
        this.historial = infopar.historial;
    }
}


export default Busquedas;