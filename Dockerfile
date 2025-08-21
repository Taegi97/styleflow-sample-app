# Dockerfile
# 1. 기반 환경으로 Java 17을 사용합니다.
FROM openjdk:17-slim

# 2. Maven이 빌드한 .jar 파일을 컨테이너 내부로 복사합니다.
#    target/*.jar는 Maven 빌드 결과물이 위치하는 경로입니다.
COPY target/*.jar app.jar

# 3. 컨테이너가 시작될 때 실행할 명령어를 지정합니다.
ENTRYPOINT ["java","-jar","/app.jar"]