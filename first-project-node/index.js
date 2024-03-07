const express = require('express') // Importando a biblioteca
const uuid = require('uuid')

const port = 3000 // Porta do servidor

const app = express() // Guardando em uma variavel para facilitar o acesso aos comandos/funçoes

app.use(express.json()) // Avidando para o express que iremos usar o formato json

/* 
    - Query params => meusite.com/users?nome=paulo&age=22 //FILTROS
    - Route params => /users/2 //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => {"name": "Paulo", "age":}

    - GET          => Buscar informações no back-end
    - POST         => Criar informação no back-end
    - PUT / PATH   => Alterar/Atualizar informação no back-end
    - DELETE       => Deletar informaçõa no back-end

    - Middleware   =>   INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params // Pegando o id pelo params (que fica na barra de pesquisa)
        
    // Encontrando o usuario no banco de dados
    const index = users.findIndex(user => user.id === id) // descobrindo qual index do usuario atraves do "id"

    //SE o id nao existe
    if(index < 0){
        return response.status(404).json({error: "User not found"}) //Retornando o "status de 404" (que significa nao encontrado), junto com uma mensagem
    }

    request.userIndex = index // Adicionando a informação do indice ao request
    request.userId = id // Passando o id que pegamos no "params" para o "request"

    next() // "next()" necessario para que continue a aplicação
}

// Rota que requisita as informações de todos os usuarios registrados
app.get('/users', (request, response ) => {
   return response.json(users)
})

// Rota que adiciona novos usuarios
app.post('/users', (request, response ) => {
    const {name, age} = request.body // Guardando as informações que recebemos

    const user = { id:uuid.v4(), name, age} // Montando o usuario

    users.push(user) // Adicionando o usuario ao "banco de dados", que no caso é uma variavel

    return response.status(201).json(user) // Retornando o status de "201", junto com o usuario que criamos
 })

// Rota que atualiza informações dos usuarios existentes
app.put('/users/:id', checkUserId, (request, response ) => {
    const { name , age } = request.body // Pegando as informações do body
    const  id  = request.userId //Pegando o id que definimos no "checkUserId"(que é um Middleware)

    const updateUser = {id, name, age} // Montando as infos do nosso user
    
    const index = request.userIndex // Pegando o indice que definimos no "checkUserId"(que é um Middleware)
    
    // Atualizando as infomações
    users[index] = updateUser

    return response.json(updateUser) // Retornando o usuario atualizado
 })
 
 // Rota de DELETE
 app.delete('/users/:id', checkUserId, (request, response ) => {
    const index = request.userIndex // Pegando o indice que definimos no "checkUserId"(que é um Middleware)

    users.splice(index,1) // DELETANDO o usuario

    return response.status(204).json()
 })




















app.listen(port, () => {
    console.log(`Server started on port ${port}!`)
}) // Porta onde essa aplicação esta rodando 

// Antes de acessar precisamos colocar no ar esse servidor, para isso digitamos no terminal "node nome-do-arquivo"
// Toda vez que alterar algo no servidor dê "CTRL+C" para finalizar a aplicação e depois inicie denovo
// npm run dev = chamar o nodmon no terminal

// "npm i uuid" usar para cirar "id" dos usuarios