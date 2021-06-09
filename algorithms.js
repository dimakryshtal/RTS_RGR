let finishedTasks = [];
let failedTasks = [];
let idleTime = 0;
let allTime = 0;

const os = require('os');
const cp = require('child_process');

const cpuCount = os.cpus().length;

const task1 = (t, arrT, d, aET) => {
    return {
        task: t,
        deadline: d,
        arrivalTime: arrT,
        startTime: 0,
        endtime: 0,
        avarageExecutionTime: aET
    }
}



const fifo = (queue, numberOfProc = 1) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0

    const queueLength = queue.length
    const queueHalves = [queue.slice(0, queueLength/2), queue.slice(queueLength/2 + 1)]

    const timeStart = Date.now()
    for (let i = 0; i < numberOfProc; i++) {
        console.log(`Processor number ${i + 1}`)
        while (queueHalves[i].length != 0) {
            const timeRan = Date.now() - timeStart
            if(timeRan >= queueHalves[i][0].arrivalTime){
                const timeNow = Date.now()
                queueHalves[i][0].startTime = timeRan
                const execTime = executeTask(queueHalves[i][0].task)
                queueHalves[i][0].endtime = queueHalves[i][0].startTime + (execTime == 0 ? 1: execTime)
                timeWhileExecuting += (Date.now() - timeNow)
                if(queueHalves[i][0].deadline < queueHalves[i][0].endtime) {
                    console.log("fifo deadline exceeded")
                    failedTasks.push(queueHalves[i].shift())
                    continue        
                }
                
            } else {
                continue
            }
            finishedTasks.push(queueHalves[i].shift())
        }
    }
    allTime = Date.now() - timeStart
    idleTime = allTime - timeWhileExecuting
}

const edf = (queue, numberOfProc = 1) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0


    const queueLength = queue.length
    const queueHalves = [queue.slice(0, queueLength/2), queue.slice(queueLength/2 + 1)]


    const timeStart = Date.now()
    for (let i = 0; i < numberOfProc; i++) {
        console.log(`Processor number ${i + 1}`)
        queueHalves[i].sort((a, b) => {a.deadline - b.deadline})

        while (queueHalves[i].length != 0) {
            allTime++;
            const timeRan = Date.now() - timeStart
            let currentIndex = 0
            const currentTask = queueHalves[i].find(element => {
                currentIndex++
                return element.arrivalTime <= timeRan
            })
            if(currentTask != undefined){
                const timeNow = Date.now()
                currentTask.startTime = timeRan
                const execTime = executeTask(currentTask.task)
                currentTask.endtime = currentTask.startTime + (execTime == 0 ? 1: execTime)
                timeWhileExecuting += (Date.now() - timeNow)
                if(currentTask.deadline < currentTask.endtime) {
                    console.log("edf deadline exceeded")
                    failedTasks.push(currentTask)
                    queueHalves[i].splice(currentIndex - 1, 1)
                    continue        
                }
                finishedTasks.push(currentTask)
                queueHalves[i].splice(currentIndex - 1, 1)
            } else {
                continue
            }
        }
    }
    allTime = Date.now() - timeStart
    idleTime = allTime - timeWhileExecuting
}

const rm = (queue, numberOfProc = 1) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0
    const queueLength = queue.length
    const queueHalves = [queue.slice(0, queueLength/2), queue.slice(queueLength/2 + 1)]


    const timeStart = Date.now()
    for (let i = 0; i < numberOfProc; i++) {
        console.log(`Processor number ${i + 1}`)
        queueHalves[i].sort((a, b) => a.avarageExecutionTime - b.avarageExecutionTime)
        while (queueHalves[i].length != 0) {
            allTime++;
            const timeRan = Date.now() - timeStart
            let currentIndex = 0
            const currentTask = queueHalves[i].find(element => {
                currentIndex++
                return element.arrivalTime <= timeRan
            })
            if(currentTask != undefined){
                const timeNow = Date.now()
                currentTask.startTime = timeRan
                const execTime = executeTask(currentTask.task)
                currentTask.endtime = currentTask.startTime + (execTime == 0 ? 1: execTime)
                timeWhileExecuting += (Date.now() - timeNow)
                if(currentTask.deadline < currentTask.endtime) {
                    console.log("rm deadline exceeded")
                    failedTasks.push(currentTask)
                    queueHalves[i].splice(currentIndex - 1, 1)
                    continue        
                }
                finishedTasks.push(currentTask)
                queueHalves[i].splice(currentIndex - 1, 1)
            } else {
                idleTime++
                continue
            }   
        }
    }
    allTime = Date.now() - timeStart
    idleTime = allTime - timeWhileExecuting
}

const calculateAvarageWaitingTime = () => {
    let sum = 0;
    for (task of finishedTasks) {
        sum += (task.startTime - task.arrivalTime)
    }
    for(task of failedTasks) {
        sum += (task.startTime - task.arrivalTime)
    }
    
    return sum/(finishedTasks.length + failedTasks.length)
}

const executeTask = (task) => {

    const signal = getSignal()
    let executionTime;
    switch (task) {
        case "discreteFourier":
            executionTime = discreteFourier(signal)
            break  
        case "fastFourier":
            executionTime = fastFourier(signal)
            break
        case "getCorrelation": 
            executionTime = getCorrelation(signal)
            break
        case "getMean": 
            executionTime = getMean(signal)
            break
        case "getVariance":
            executionTime = getVariance(signal)
            break
    }

    return executionTime
}
