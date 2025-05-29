FROM maven:3.8.6-eclipse-temurin-17

WORKDIR /app
COPY . .

RUN mvn clean install

CMD ["java", "-jar", "target/renovai-1.0-SNAPSHOT.jar"]
