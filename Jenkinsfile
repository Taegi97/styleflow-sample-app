// Jenkinsfile (Final Version)
pipeline {
    agent any
    
    tools {
        maven 'maven3'
        jdk 'jdk17'
    }

    environment {
        // 이미지 이름과 태그를 여기서 중앙 관리합니다.
        // Docker Hub 사용자 이름이 정확한지 다시 한번 확인하십시오.
        IMAGE_NAME = "taegi-security/styleflow-app"
        IMAGE_TAG = env.BUILD_NUMBER // Jenkins 빌드 번호를 태그로 사용
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
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                
                // Docker Hub Credential을 안전하게 사용하기 위한 withCredentials 블록
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    
                    // 1. Docker 이미지 빌드
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    
                    // 2. Docker Hub 로그인
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    
                    // 3. Docker Hub으로 이미지 푸시
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                echo "Deploying image ${IMAGE_NAME}:${IMAGE_TAG} to EKS..."
                
                // Kubeconfig Credential을 안전하게 사용
                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG_FILE')]) {
                    
                    // 참고: 이 단계는 아직 성공하지 않습니다.
                    // 먼저 EKS 클러스터에 styleflow-deployment 라는 이름의 Deployment를
                    // 한번은 수동으로 만들어주어야 합니다.
                    sh "kubectl --kubeconfig=${KUBECONFIG_FILE} set image deployment/styleflow-deployment styleflow-app-container=${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }
}