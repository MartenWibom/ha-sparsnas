pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t moddha/ha-sparsnas .'
      }
    }
    stage('Deploy') {
      steps {
        sh '''docker stop ha-sparsnas || true
docker rm ha-sparsnas || true
'''
        sh '''docker run -d --name ha-sparsnas --net home-automation --hostname ha-sparsnas --restart=unless-stopped moddha/ha-sparsnas:latest
'''
      }
    }
  }
}