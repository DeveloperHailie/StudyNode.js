module.exports = {
  apps : [{
    script    : "test.js", 
    instances : "max", 
    exec_mode : "cluster" 
  }]
}