pipeline {
    agent any

    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        IMAGE_NAME = "taeginam/styleflow-app"
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
                // withAWS 플러그인 사용, AWS 인증 및 리전 지정
                withAWS(credentials: 'aws-credentials', region: env.AWS_REGION) {
                    script {
                        def imageTag = env.BUILD_NUMBER
                        echo "Deploying image ${IMAGE_NAME}:${imageTag} to EKS..."

                        // kubeconfig 재생성(필요 시 기존 config 삭제는 별도 조치)
                        sh "aws eks update-kubeconfig --name styleflow-cluster --region ${env.AWS_REGION}"

                        // Kubernetes Deployment에 이미지 태그 업데이트
                        sh "kubectl set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${imageTag}"
                    }
                }
            }
        }
    }
}
