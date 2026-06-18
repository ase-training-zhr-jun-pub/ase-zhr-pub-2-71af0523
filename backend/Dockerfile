FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY gradlew build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
RUN chmod +x gradlew

# Dependencies vorab laden (eigener Layer → wird gecacht, solange Build-Dateien gleich bleiben)
RUN ./gradlew dependencies --no-daemon --quiet

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
