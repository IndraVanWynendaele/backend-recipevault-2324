# Examenopdracht Web Services

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten

Installeer alle dependencies met het volgende commando:

```bash
yarn install
```

Maak een `.env` bestand aan de hand van dit template:

```dotenv
NODE_ENV=development
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
```

Start de website met `yarn start`. Het runt standaard op <http://localhost:9000> 

## Testen

Installeer alle dependencies met het volgende commando (als dit nog niet eerder gedaan werd):

```bash
yarn install
```

Maak een `.env.test` bestand aan de hand van dit template:

```dotenv
NODE_ENV=test
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
```

Voer de testen uit met het commando `yarn test`.
