# Configuatrion du projet :

 
## Configuration du projet Spring Boot

Voici les choix retenus pour initialiser le projet.

| Paramètres                 | Configuration                 |
|-------------------------|--------------------------------------------|
| Project                    | Maven                                      |
| Language                   | Java                                       |
| Version de Java            | Java 21 (LTS)                              |
| Configuration              | YAML                                       |
| Fichier de configuration   | `src/main/resources/application.yml`       |
| Packaging                  | JAR                                        |

### Pourquoi ces choix ?

- Maven : outil largement utilisé dans les projets Java, avec une
configuration standardisée dans pom.xml.

- Java 21 (LTS) : version stable à support long terme, compatible
avec Spring Boot 3.x et 4.x.

- YAML : format lisible et hiérarchique, pratique pour organiser
les paramètres de l'application.

- JAR : permet de construire une application Spring Boot
exécutable de manière autonome.

Exemple de `configuration YAML`

Le fichier `src/main/resources/application.yml` pourra contenir, par
exemple :
bash 
```
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mon_projet
    username: postgres
    password: ${DB_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```
Remplace mon_projet par le nom réel de ta base de données. Il est
préférable de fournir le mot de passe via une variable d'environnement
(DB_PASSWORD) plutôt que de l'inscrire directement dans le fichier.

### Remarque sur Spring Boot : 

Le choix conseillé précédemment était Spring Boot 3.5.x avec Java 21
pour privilégier la maturité de l'écosystème. Java 21 est également
compatible avec Spring Boot 4, sous réserve de vérifier la compatibilité
des dépendances utilisées.

### Récapitulatif

Maven + Java 21 (LTS) + YAML + JAR + Spring Boot 3.5.x.


## Configuration du projet NEXT.js 

Il est juste question de creer Next.js via la commande : 
node
```
npx create-next-app@latest ecampus-frontend
```