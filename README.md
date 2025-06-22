

## CLI (Comman Line Interface)
~~~
# Show help
$ python cli/main.py --help
~~~

~~~
# Load pathways
$ python cli/main.py load-pathway
$ python cli/main.py load-pathway --pathways hsa04210,hsa04152
$ python cli/main.py load pathway \
  --pathways hsa04210 \
  --nodes hsa04210_nodes.tsv \
  --relations hsa04210_relations.tsv \
  --metadata hsa04210_metadata.tsv
~~~

~~~
# Load circuits
$ python cli/main.py load-circuit
$ python cli/main.py load-circuit --diseases FamiMela
~~~

# Example execution in Docker docker-compose.yml
~~~
cli:
  build: ./cli
  entrypoint: ["python", "main.py", "load-pathway", "--pathways", "hsa04210,hsa04152"]
  ...
~~~


# Test
~~~
//pytest    pytest tests/test_load_pathway.py

docker compose run --rm --entrypoint=pytest cli tests/
~~~


# Add info
~~~
docker compose run --rm cli --help
docker compose run --rm cli load-pathway --help
docker compose run --rm cli load-pathway --pathways hsa04210
docker compose run --rm cli load-pathway --input /app/data/example.json
~~~

# Add user to group docker
~~~
#Create the docker group
sudo groupadd docker

#Add your user to the docker group
sudo usermod -aG docker $USER

#Activate the changes to groups
newgrp docker
~~~


# Rebuild all
docker-compose down -v
docker-compose build --no-cache
docker-compose up
#Eliminar contenedor de VSCode si quedó colgado
docker container prune -f
#Reconstruir desde cero
docker-compose up --build


# Development in container VS-Code
F1
Remote-Containers: Rebuild and Reopen in Container

docker exec -it drugvi-web sh
npm install --save-dev @types/react @types/react-dom


docker-compose --env-file .env up --build
docker-compose config



https://storage.googleapis.com/public-download-files/hgnc/archive/archive/monthly/tsv/hgnc_complete_set_2021-03-01.txt