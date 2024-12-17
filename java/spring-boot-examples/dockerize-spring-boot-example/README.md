# Spring Boot Docker Example

This project demonstrates two different approaches to dockerizing a Spring Boot application:
1. Multi-stage build (building inside Docker)
2. Local Maven build (using pre-built JAR)

## Prerequisites

- Java 17
- Maven 3.9+
- Docker
- Docker Compose

## Option 1: Multi-stage Build Approach

This approach builds the application inside Docker container.

### Files Structure
```
├── src/
├── pom.xml
├── Dockerfile.multistage
└── docker-compose.yml
```

### Dockerfile.multistage
```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17-focal AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Download dependencies and build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy the built artifact from build stage
COPY --from=build /app/target/*.jar app.jar

# Configure JVM options for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Expose the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Running with Multi-stage Build

```bash
# Build and run with docker-compose
docker-compose build --no-cache
docker-compose up

# Or to do both in one command
docker-compose up --build
```

## Option 2: Local Maven Build Approach

This approach uses locally built JAR file.

### Files Structure
```
├── src/
├── target/
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

### Dockerfile
```dockerfile
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy the pre-built jar from your local target directory
COPY target/*.jar app.jar

# Set ownership of the jar file to the spring user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring:spring

# Configure JVM options for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Expose the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Running with Local Build

```bash
# First, build the application with Maven
mvn clean package -DskipTests

# Then build and run with docker-compose
docker-compose build --no-cache
docker-compose up

# Or to do both in one command (still need Maven build first)
docker-compose up --build -d
```

## Environment Variables

The application uses the following environment variables that can be set in docker-compose.yml:

```yaml
environment:
  MYSQL_HOST: mysql
  SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/project_db?useSSL=false&allowPublicKeyRetrieval=true
  SPRING_DATASOURCE_USERNAME: project_user
  SPRING_DATASOURCE_PASSWORD: project_password
```

## Database Configuration

MySQL database is configured with the following default settings:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: rootpassword
  MYSQL_DATABASE: project_db
  MYSQL_USER: project_user
  MYSQL_PASSWORD: project_password
```

## Comparison of Approaches

### Multi-stage Build (Option 1)
#### Pros:
- No need for local Maven installation
- Consistent build environment
- Single command to build and run
- Good for CI/CD pipelines

#### Cons:
- Larger image size (includes build tools)
- Longer build time
- Can't use local Maven settings/cache

### Local Maven Build (Option 2)
#### Pros:
- Smaller final image
- Faster Docker builds
- Uses local Maven cache
- More control over build process

#### Cons:
- Requires local Maven installation
- Two-step build process
- Need to remember to rebuild JAR when code changes

## Common Docker Commands

```bash
# Remove all containers and volumes
docker-compose down -v

# View logs
docker-compose logs -f

# Rebuild without cache and start
docker-compose build --no-cache && docker-compose up -d

# Stop all containers
docker-compose down

# Check container status
docker-compose ps
```