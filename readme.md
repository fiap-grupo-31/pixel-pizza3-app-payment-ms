![Static Badge](https://img.shields.io/badge/v11-version?logo=typescript&color=%234169E1&labelColor=white&label=Typescript)
![Static Badge](https://img.shields.io/badge/v18-version?logo=node.js&color=%234169E1&labelColor=white&label=Nojes)
[![MySQL Version](https://img.shields.io/badge/MySQL-v8-blue?logo=mysql&labelColor=white)](https://www.mysql.com/)
![Static Badge](https://img.shields.io/badge/v11-version?logo=ubuntu&color=%234169E1&labelColor=white&label=Ubuntu) ![Static Badge](https://img.shields.io/badge/v20-version?logo=docker&color=%234169E1&labelColor=white&label=Docker) ![Static Badge](https://img.shields.io/badge/v1.29.2-version?logo=dockercompose&color=%234169E1&labelColor=white&label=DockerCompose) ![Static Badge](https://img.shields.io/badge/vOAS3-version?logo=swagger&color=%234169E1&labelColor=white&label=Swagger)



# Tech Challenge - Fase 04 (GRUPO 31) - Sistema de gestão de pedidos - Microserviço de Pagamentos

Consiste no microserviço de um sistema de gestão de pedidos para processamento de pagamentos incluindo as seguintes caracteristicas:

## Caracteristicas

- Enpoint de recebimento do pedido de pagamento
- Webhook para recebimento do callback fake pagamento
- Integração com mercado pago
- Webhook para recebimento do callback do mercado pago
- Pipeline GitActions Workflow para execução de testes e build da imagem em ECR AWS

## Requisitos para execução direta

- Debian: 11 ou superior | Ubuntu: 20
- Node: 18 ou superior
- Banco de dados Mysql

## Requisitos para execução via docker

- Docker: 20 ou superior
- Docker-compose: 1.29.2 ou superior

## Execução dos testes unitários

- npm run test

## Gerar a versão de distribuição /dist ( se necessário )

Executar o comando abaixo para gerar automaticamente o dist
- npm run build

## Execução via docker
A execução da aplicação via docker-compose permite a execução do microserviço com escalabilidade horizontal (via replicas do container).

Para executar o modelo padrão da atividade executando 2 instâncias (1 para aplicação e 1 para o banco de dados), acesse o diretorio onde está o código e digite o comando a seguir:

    docker-compose up

Ele irá provisionar uam instância de banco de dados (mysql) e aplicar um build no Dockerfile para provisionar a instância de aplicação. Em tela irá apresentar o log continuo da execução dos serviços.

Para executar o pacote sem visualizar os log's, execute o comando abaixo:

    docker-compose up -d

Para encerrar o serviço digite o comando a seguir: 

    docker-compose down

## Documentação das API's

A documentação pode ser acessada via browser digitando o endereço abaixo quando a aplicação estiver em execução:

    http://localhost:8080/api-docs/

Para acessar diretamente [clique aqui](http://localhost:8080/api-docs/)

O swagger é um framework composto por diversas ferramentas que, independente da linguagem, auxilia a descrição, consumo e visualização de serviços de uma API REST e foi selecionado para documentação dos endpoints do backend da aplicação.

- PAGAMENTO (payments)
    - Permite retornar a lista de pedidos de pagamento
    - Efetua o pedido de pagamento para o broker (fake e meli)
    - Permite retornar um pedido de pagamento com seu respectivo status por ID
    - Endpoint webhook para fake pagamento
    - Endpoint webhook para execução do pagamento vindo do mercado pago

## Requisitos para jornada de teste

### Mercado pago

É necessário incluir no docker-compose.yaml e no deployment-apis.yaml e pod-apis.yaml as enviroment (env) da configuração do mercado pago.

```
MELI_USER_ID: 
MELI_POSID: 
MELI_TOKEN: 
```


## Jornada de teste

Retorna lista de pedidos
```
curl --location 'http://localhost:8080/payment'
```

Retorna lista de pedidos por id
```
curl --location 'http://localhost:8080/payment/{id}'
```

Efetua pedido de pagamento fake
```
curl --location 'http://localhost:8080/payment' \
--header 'Content-Type: application/json' \
--data '{
  "orderId": "123456789",
  "broker": "fake",
  "quantity": 1,
  "amount": 10
}'

```

Efetua pedido de pagamento mercado pago
```
curl --location 'http://localhost:8080/payment' \
--header 'Content-Type: application/json' \
--data '{
  "orderId": "123456789",
  "broker": "mercadopago",
  "quantity": 1,
  "amount": 10
}'

```


#### Webhook para o pagamento 'fake': validação APPROVED, DENIED, CANCELED
```
curl --location 'http://localhost:8080/payment/webhook/{IdPedidoPagamento}' \
--header 'Content-Type: application/json' \
--data '{
    "status": "APPROVED",
    "description": ""
}'
```

#### Webhook para o pagamento 'mercadopago'
```
curl --location 'http://localhost:8080/payment/webhook/mercadopago/{IdPedidoPagamento}' \
--header 'Content-Type: application/json' \
--data '{
  "action": "payment.created",
  "api_version": "v1",
  "data": {
    "id": "62769692566"
  },
  "date_created": "2023-08-26T20:38:56Z",
  "id": 107245981863,
  "live_mode": true,
  "type": "payment",
  "user_id": "157842011"
}'
```
Para representar o teste acima configure o enviroment "MELI_WEBHOOK" com o link do webhook.site, export curl e troque o "https://webhook.site/XXXXXXXXXXXXXXXXXXXXXXXX/" por "http://localhost:8080/payment/webhook/mercadopago/" e execute o post para obter o resultado de pagamento



## Requisitos para teste unitário automatizado via GitActions e BuildImage para registro no ECR AWS

* [Terraform](https://www.terraform.io/) - Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. Terraform codifies cloud APIs into declarative configuration files.
* [Amazon AWS Account](https://aws.amazon.com/it/console/) - Amazon AWS account with billing enabled
* [aws cli](https://aws.amazon.com/cli/) optional

## Antes de começar

Esta execução esta fora do nível gratuito da AWS, importante avaliar antes de executar

## AWS configuração

Com os requisitos já identificados, configure abaixo no secrets do github.

```
AWS_ACCESS_KEY = "xxxxxxxxxxxxxxxxx"
AWS_SECRET_KEY = "xxxxxxxxxxxxxxxxx"
```

## Uso

Com os requisitos já identificados, configure abaixo no secrets do github.

```
   runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'
    needs:
      - run-tests

    steps:
    - name: Checkout do repositório
      uses: actions/checkout@v2

    - name: Configurando a AWS Credentials Action para o GitHub Actions
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_KEY }}
        aws-region: ${{ env.AWS_REGION }}
      
    - name: Login em Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Instala dependencias
      run: |
        npm install

    - name: Gera versão de distribuição
      run: |
        npm run build

    - name: Build do Dockerfile, criação da Tag e Push Image em Amazon ECR
      id: build-image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
      run: |
        docker image build \
        --tag ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:latest \
        --tag ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.SHORT_SHA }} \
        .
        docker push ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:latest
        docker push ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.SHORT_SHA }}
        echo ${{ steps.login-ecr.outputs.registry }}
```

### Execução do projeto

Ao efetuar um push no repositório develop com sucesso, é necessário efetuar um pull request na branch master para que a execução do pipeline do workflow seja executado
