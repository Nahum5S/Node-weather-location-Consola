require("dotenv").config();
const {
  leerInput,
  inquiererMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquiererMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        //Buscar los lugares
        const lugares = await busquedas.ciudad(termino);
        //Seleccionar el lugar
        const id = await listarLugares(lugares);
        if(id === '0')continue;
        const lugarSel = lugares.find((l) => l.id === id);
        //Gaurdar en DB
        busquedas.agregarHistorial( lugarSel.nombre );
        //Clima
        const clima = await busquedas.climLugar(lugarSel.lat, lugarSel.lng);
        //Mostrar resultados
        console.clear();
        console.log("\nInformación de al ciudad".green);
        console.log("Ciudad: ", lugarSel.nombre.green);
        console.log("Lat: ", lugarSel.lat);
        console.log("Long: ", lugarSel.lng);
        console.log("Temperatura: ", clima.temp);
        console.log("Mínima: ", clima.min);
        console.log("Máxima: ", clima.max);
        console.log("Como está el clima: ", clima.desc.green);
        break;
      case 2:
        busquedas.historialCapitalizado.forEach( (lugar, i) => {
            const idx = `${i+1}.`.green;
            console.log( `${idx} ${lugar}`)
        });

        break;
    }

    await pausa();
  } while (opt !== 0);
};

main();
