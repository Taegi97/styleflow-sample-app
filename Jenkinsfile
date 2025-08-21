// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "your_dockerhub_username/styleflow-app"
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig-credentials')
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                // Maven을 사용하여 .jar 파일을 빌드합니다.
                bat 'mvn package'
            }
        }
        stage('Build Image') {
            steps {
                echo 'Building the Docker image...'
                // Dockerfile을 사용하여 컨테이너 이미지를 빌드합니다.
                bat "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
            }
        }
        stage('Push Image') {
            steps {
                echo 'Pushing the Docker image...'
                // Docker Hub에 로그인하여 이미지를 푸시합니다.
                bat 'echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin'
                bat "docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo 'Deploying to EKS...'
                // Kubeconfig 파일을 설정하고, 새로운 이미지 태그로 Deployment를 업데이트합니다.
                bat "echo ${KUBECONFIG_CREDENTIALS} > kubeconfig"
                bat "kubectl --kubeconfig=kubeconfig set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }
    }
}