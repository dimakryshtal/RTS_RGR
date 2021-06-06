let finishedTasks = [];
let failedTasks = [];
let idleTime = 0;
let allTime = 0;

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



const fifo = (queue) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0
    const timeStart = Date.now()
    while (queue.length != 0) {
        const timeRan = Date.now() - timeStart
        if(timeRan >= queue[0].arrivalTime){
            const timeNow = Date.now()
            queue[0].startTime = timeRan
            const execTime = executeTask(queue[0].task)
            queue[0].endtime = queue[0].startTime + (execTime == 0 ? 1: execTime)
            timeWhileExecuting += (Date.now() - timeNow)
            if(queue[0].deadline < queue[0].endtime) {
                console.log("fifo deadline exceeded")
                failedTasks.push(queue.shift())
                continue        
            }
            
        } else {
            continue
        }
        finishedTasks.push(queue.shift())
    }
    allTime = Date.now() - timeStart
    idleTime = allTime - timeWhileExecuting
}

const edf = (queue) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0

    queue.sort((a, b) => {a.deadline - b.deadline})

    const timeStart = Date.now()
    while (queue.length != 0) {
        allTime++;
        const timeRan = Date.now() - timeStart
        let currentIndex = 0
        const currentTask = queue.find(element => {
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
                queue.splice(currentIndex - 1, 1)
                continue        
            }
            finishedTasks.push(currentTask)
            queue.splice(currentIndex - 1, 1)
        } else {
            continue
        }
    }
    allTime = Date.now() - timeStart
    idleTime = allTime - timeWhileExecuting
}

const rm = (queue) => {
    finishedTasks = []
    failedTasks = []
    idleTime = 0
    allTime = 0
    let timeWhileExecuting = 0

    queue.sort((a, b) => a.avarageExecutionTime - b.avarageExecutionTime)
    const timeStart = Date.now()
    while (queue.length != 0) {
        allTime++;
        const timeRan = Date.now() - timeStart
        let currentIndex = 0
        const currentTask = queue.find(element => {
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
                queue.splice(currentIndex - 1, 1)
                continue        
            }
            finishedTasks.push(currentTask)
            queue.splice(currentIndex - 1, 1)
        } else {
            idleTime++
            continue
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
