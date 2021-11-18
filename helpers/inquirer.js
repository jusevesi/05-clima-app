const inquirer = require('inquirer');
const { validate } = require('uuid');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name:`${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name:`${'2.'.green} Historial`
            },
            {
                value: 0,
                name:`${'0.'.green} Salir`
            },
        ]
    }
]

const inquirerMenu = async() =>{

    // console.clear();
    console.log('==========================='.green);
    console.log('  Seleccione una opcion'.bold);
    console.log('==========================='.green);

    const { opcion } = await inquirer.prompt(preguntas);
    
    return opcion ;
}

const pausa = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'anykey',
            message:`\nPresione ${ 'ENTER'.green} para continuar.\n`,
        }
    ]
    
    console.log('');
    await inquirer.prompt(question);
}
    
const leerInput = async() =>{

    const question = [
        {
            type: 'input',
            name: 'desc',
            validate(value) {
                if(value.length ===0 ) {
                    return 'Por favor ingrese un valor';
                }  
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async( lugares = []) =>{

    const choices = lugares.map( (lugar, i) => {
        
        const idx = `${i+1}`.green;

        return{
            value: lugar.id,
            name: `${idx} ${lugar.name}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.green +' Cancelar'
    });

    const preguntas = [ 
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async(message) =>{
    const question =[
        {
            type: 'confirm',
            name:'ok',
            message
        }
    ];
    const {ok} = await inquirer.prompt(question);
    return ok;
}


const mostrarListadoChecklist = async( tareas = []) =>{

    const choices = tareas.map( (tarea, i) => {
        
        const idx = `${i+1}`.green;

        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false 
        }
    });

    const preguntas = [ 
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(preguntas);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}