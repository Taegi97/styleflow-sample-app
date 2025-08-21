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
                sh 'mvn package'
            }
        }
        stage('Build Image') {
            steps {
                echo 'Building the Docker image...'
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
            }
        }
        stage('Push Image') {
            steps {
                echo 'Pushing the Docker image...'
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo 'Deploying to EKS...'
                sh '''
                    echo "${KUBECONFIG_CREDENTIALS}" > kubeconfig
                    kubectl --kubeconfig=kubeconfig set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
    }
}
