pipeline {
    agent any

    environment {
        APP_DIR = "/home/user/Time4Trivia-Start"
    }

    stages {
        stage('Clone and Install') {
            steps {
                // Clone from GitHub
                git branch: 'main', url: 'https://github.com/ahezekiah/Time4Trivia-Start.git'

                // Install dependencies in Jenkins workspace
                sh 'npm install'
            }
        }

        stage('Sync to App Directory') {
            steps {
                // Copy new code to your app directory
                sh '''
                    # Stop the app
                    pm2 stop time4trivia
                    
                    # Copy files
                    cp -r * ${APP_DIR}/
                    
                    # Remove Jenkins-specific files
                    rm -f ${APP_DIR}/Jenkinsfile ${APP_DIR}/.git*
                    
                    # Fix ownership (in case Jenkins runs as jenkins user)
                    chown -R user:user ${APP_DIR}
                '''
            }
        }

        stage('Restart App') {
            steps {
                sh 'pm2 start time4trivia || pm2 start npm --name "time4trivia" -- start'
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
