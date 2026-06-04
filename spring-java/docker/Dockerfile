# ==============
#  Builder Image
# ==============
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# ==============
#  Final Image
# ==============
FROM eclipse-temurin:21-jre AS production
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV SERVER_PORT=3000

USER 10001

EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
