pipeline {
    agent any

    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        IMAGE_NAME = "taegi-security/styleflow-app"
        IMAGE_TAG = "" // 빈 문자열 또는 기본값 지정
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // 런타임에 IMAGE_TAG 설정
                    env.IMAGE_TAG = env.BUILD_NUMBER
                }
                echo "Building the application..."
                sh 'mvn clean package'
            }
        }
        stage('Build & Push Image') {
            steps {
                echo "Building Docker image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo "Deploying image ${env.IMAGE_NAME}:${env.IMAGE_TAG} to EKS..."
                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG_FILE')]) {
                    sh "kubectl --kubeconfig=${KUBECONFIG_FILE} set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }
}
