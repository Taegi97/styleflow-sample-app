// Jenkinsfile (FINAL AUTHENTICATED VERSION)
pipeline {
    agent any

    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        IMAGE_NAME = "taeginam/styleflow-app"
        // EKS 클러스터가 있는 AWS 리전을 지정합니다.
        AWS_REGION = "ap-northeast-2" 
    }

    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('Build & Push Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        def imageTag = env.BUILD_NUMBER
                        sh "docker build -t ${IMAGE_NAME}:${imageTag} ."
                        sh "echo \"${DOCKER_PASS}\" | docker login -u \"${DOCKER_USER}\" --password-stdin"
                        sh "docker push ${IMAGE_NAME}:${imageTag}"
                    }
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                // withAWS 블록으로 감싸서, 이 안의 모든 명령어가 'aws-credentials'를 사용하도록 합니다.
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    script {
                        def imageTag = env.BUILD_NUMBER
                        echo "Deploying image ${IMAGE_NAME}:${imageTag} to EKS..."

                        // 1. kubectl이 이 컴퓨터의 kubeconfig를 사용하도록 업데이트합니다.
                        sh "aws eks update-kubeconfig --name styleflow-cluster"

                        // 2. Deployment의 이미지를 새로운 버전으로 교체합니다.
                        sh "kubectl set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${imageTag}"
                    }
                }
            }
        }
    }
}