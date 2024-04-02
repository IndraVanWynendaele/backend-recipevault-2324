[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/TA_3CB_a)

# Examenopdracht Web Services

- Student: INDRA VAN WYNENDAELE
- Studentennummer: 202289380
- E-mailadres: <mailto:indra.vanwynendaele@student.hogent.be>

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