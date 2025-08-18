pipeline {
    agent any

    environment {
        APP_DIR = "/home/user/Time4Trivia-Start"
        NODE_ENV = "production"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ahezekiah/Time4Trivia-Start.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd ${APP_DIR}
                    npm install
                '''
            }
        }

        stage('Restart App with PM2') {
            steps {
                sh '''
                    cd ${APP_DIR}
                    pm2 restart npm -- start
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
