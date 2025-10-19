//Set up Amplify DataStore
//---npm install -g @aws-amplify/cli
//---amplify init
//npm install aws-amplify


//--- amplify delete --- para borrar todo el backend anterior en caso de exister y saltarse los pasos de arriba solo aplicar de aqui hacia abajo

//para resolver el tema de conflictos con trabajar base de datos de amplify eredada.

//seleccionamos api-key
//---amplify update api
//despues para la resolucion de conflicos seleccionamos datastore y posterios AUTOMERGE a todo tanto a los modelos como a todo


//Create an API with GraphQL with datastore disabled, and conflict resolution unconfigured
//Make a mutation using the console, or programatically via API.mutate(...)
//Note that the entries made in dynamo will only NOT have the following two fields:
//_lastChangedAt
//_version
//Enable Datastore by using the CLI:

//---amplify update api

//Then choose: GraphQL
//Then Choose: Enable DataStore for entire API

//Enable Conflict resolution:

//--amplify update api

//Then choose the following options:

//? Please select from one of the below mentioned services:
//   GraphQL
//? Select from the options below
//   Walkthrough all configurations
//? Choose the default authorization type for the API
//   API key
//? Enter a description for the API key:
//   restaurantdatastore - descricion para la api key
//? After how many days from now the API key should expire (1-365):
//   365
//? Do you want to configure advanced settings for the GraphQL API
//   Yes, I want to make some additional changes.
//? Configure additional auth types?
//   No
//? Configure conflict detection?
// Yes
//? Select the default resolution strategy
//  Auto Merge
//? Do you want to override default per model settings?
//  Yes
//? Select the models from below:
//  Restaurant - el nombre de la base que generaste
//? Select the resolution strategy for Restaurant model
//  Auto Merge

//---generar los modelos de las bases local
//---amplify codegen models

//opocional
//---amplify update codegen

//para actualizar los cambios en el servidor
//---amplify push



//pasos para subir a un repositorio

/* 
git init  
git remote add origin https://github.com/Intelego-proyectos/FEMSA-CODIGO-ETICA.git -f
git branch -M main
git remote -v  
git pull https://github.com/Intelego-proyectos/FEMSA-CODIGO-ETICA.git

git add . 
git commit -m 'subir un archivo' 
git push --set-upstream https://github.com/Intelego-proyectos/FEMSA-CODIGO-ETICA.git main 

*/
