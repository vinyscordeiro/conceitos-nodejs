const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idValidation(request,response,next){
  const {id} =request.params;
  const validate = repositories.find(repository =>repository.id ===id)
  if(!validate){
    return response.status(400).json({ error:"Index Not Found"})
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} =request.body;
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes:0
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", idValidation,(request, response) => {
  const {id} = request.params;
  const {title,url,techs} =request.body;
  const repositoryID = repositories.findIndex(repository => repository.id===id);
  const {likes}=repositories[repositoryID];

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }
  repositories[repositoryID]=repository;

  return response.json(repository);

});

app.delete("/repositories/:id",idValidation, (request, response) => {
  const {id} = request.params;

  const repositoryID = repositories.findIndex(repository => repository.id===id);
  
  repositories.splice(repositoryID,1);
  return response.status(204).json();
});

app.post("/repositories/:id/like",idValidation, (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(repository => repository.id ===id);

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
