FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

FROM eclipse-temurin:17
WORKDIR /app
COPY --from=build /app/target/renovai-1.0-SNAPSHOT-shaded.jar app.jar
ENV OPENAI_API_KEY=$OPENAI_API_KEY
CMD ["java", "-jar", "app.jar"]
