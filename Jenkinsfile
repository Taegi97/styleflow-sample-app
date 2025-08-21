// Jenkinsfile (Final Corrected Version)
pipeline {
    agent any

    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        // Docker Hub 사용자 이름. 정확한지 다시 한번 확인하십시오.
        IMAGE_NAME = "taegi-security/styleflow-app" 
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'mvn clean package'
            }
        }
        stage('Build & Push Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${env.BUILD_NUMBER}"

                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {

                    // 1. Docker 이미지 빌드 (env.BUILD_NUMBER를 직접 사용)
                    sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."

                    // 2. Docker Hub 로그인
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                    // 3. Docker Hub으로 이미지 푸시 (env.BUILD_NUMBER를 직접 사용)
                    sh "docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo "Deploying image ${IMAGE_NAME}:${env.BUILD_NUMBER} to EKS..."

                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG_FILE')]) {

                    // 참고: 이 단계는 아직 성공하지 않습니다.
                    // 먼저 EKS 클러스터에 styleflow-deployment 라는 이름의 Deployment를
                    // 한번은 수동으로 만들어주어야 합니다.
                    sh "kubectl --kubeconfig=${KUBECONFIG_FILE} set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}