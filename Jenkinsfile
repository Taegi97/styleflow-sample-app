// Jenkinsfile
pipeline {
    agent any
    
    // 이 파이프라인이 사용할 도구들을 선언합니다.
    // Jenkins > Manage Jenkins > Tools 에서 설정한 이름과 일치해야 합니다.
    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        // Jenkins > Manage Jenkins > Credentials 에서 설정한 ID와 일치해야 합니다.
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig-credentials')
        
        // 당신의 Docker Hub 사용자 이름으로 수정하십시오.
        IMAGE_NAME = "taegi-security/styleflow-app" 
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                // Maven을 사용하여 .jar 파일을 빌드합니다.
                sh 'mvn clean package'
            }
        }
        stage('Build Image') {
            steps {
                echo 'Building the Docker image...'
                // Dockerfile을 사용하여 컨테이너 이미지를 빌드합니다.
                // ${env.BUILD_NUMBER}는 Jenkins가 빌드마다 자동으로 부여하는 고유 번호입니다.
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
            }
        }
        stage('Push Image') {
            steps {
                echo 'Pushing the Docker image...'
                // Docker Hub에 로그인하여 이미지를 푸시합니다.
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKHUB_CREDENTIALS_USR --password-stdin
                    docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}
                '''
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo 'Deploying to EKS...'
                // 참고: 이 단계는 아직 성공하지 않습니다.
                // 먼저 EKS 클러스터에 styleflow-deployment 라는 이름의 Deployment를
                // 한번은 수동으로 만들어주어야 합니다.
                sh '''
                    echo "${KUBECONFIG_CREDENTIALS}" > ./kubeconfig
                    kubectl --kubeconfig=./kubeconfig set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${env.BUILD_NUMBER}
                '''
            }
        }
    }
}