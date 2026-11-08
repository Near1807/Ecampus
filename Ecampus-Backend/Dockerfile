# Étape 1 : compilation
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Téléchargement des dépendances en cache (relancé seulement si le pom change)
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# Étape 2 : exécution
FROM eclipse-temurin:21-jre

WORKDIR /app

# Exécution avec un utilisateur non-root
RUN groupadd --system spring && useradd --system --gid spring spring

COPY --from=build /app/target/*.jar app.jar

USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
