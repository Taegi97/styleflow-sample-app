// Jenkinsfile (Definitive Final Version)
pipeline {
    agent any
    
    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        // Docker Hub 사용자 이름/이미지 이름. 정확한지 다시 한번 확인하십시오.
        IMAGE_NAME = "taeginam/styleflow-app" 
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                // Maven을 사용하여 .jar 파일을 빌드합니다.
                sh 'mvn clean package'
            }
        }
        stage('Build & Push Image') {
            steps {
                // withCredentials 블록을 사용하여 Docker Hub 비밀번호를 안전하게 로드합니다.
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    
                    // 현재 빌드 번호를 이미지 태그로 사용할 변수를 정의합니다.
                    def imageTag = "${env.BUILD_NUMBER}"
                    echo "Building and pushing Docker image: ${IMAGE_NAME}:${imageTag}"

                    // 1. Docker 이미지 빌드
                    sh "docker build -t ${IMAGE_NAME}:${imageTag} ."
                    
                    // 2. Docker Hub 로그인
                    // 큰따옴표("")를 사용하여 Groovy 변수($DOCKER_PASS, $DOCKER_USER)가 쉘 스크립트에 올바르게 전달되도록 합니다.
                    sh "echo \"${DOCKER_PASS}\" | docker login -u \"${DOCKER_USER}\" --password-stdin"
                    
                    // 3. Docker Hub으로 이미지 푸시
                    sh "docker push ${IMAGE_NAME}:${imageTag}"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                // withCredentials 블록을 사용하여 kubeconfig 파일을 안전하게 로드합니다.
                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG_FILE')]) {
                    
                    def imageTag = "${env.BUILD_NUMBER}"
                    echo "Deploying image ${IMAGE_NAME}:${imageTag} to EKS..."

                    // 참고: 이 단계는 아직 성공하지 않습니다.
                    // 먼저 EKS 클러스터에 styleflow-deployment 라는 이름의 Deployment를
                    // 한번은 수동으로 만들어주어야 합니다.
                    sh "kubectl --kubeconfig=${KUBECONFIG_FILE} set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${imageTag}"
                }
            }
        }
    }
}