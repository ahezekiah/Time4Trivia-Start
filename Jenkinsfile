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
                     # Copy new code to app directory
                     cp -r * ${APP_DIR}/
                     # Clean up
                     rm -f ${APP_DIR}/Jenkinsfile ${APP_DIR}/.git*
                     # Ensure ownership
                     chown -R user:user ${APP_DIR}
                  '''
            }
        }

        stage('Restart App') {
            steps {
                 sh '''
                     # Run pm2 commands as user
                     sudo -u user pm2 stop time4trivia || echo "App not running"
                     sudo -u user pm2 start npm --name "time4trivia" -- start
                     sudo -u user pm2 save
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
