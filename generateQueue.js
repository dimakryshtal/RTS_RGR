const generateQueue = (numberOfTasks, intensity) => {
    const queue = [];
    let x = Math.ceil(numberOfTasks/intensity);
    for (let j = 0; j < x; j++) {
        const currentDeadline = 100 * j
        for (let i = 0; i < intensity; i++) {
            const rand = Math.floor(Math.random() * 4)
            const rand2 = Math.floor(Math.random() * 2) + 1
            let task;
            switch (rand) {
                case 0:
                    task = task1("discreteFourier", 100 * j, currentDeadline + 100 * rand2 * intensity, 66)
                    break
                case 1:
                    task = task1("fastFourier", 100 * j, currentDeadline + 80 * rand2 * intensity, 35)
                    break
                case 2:
                    task = task1("getCorrelation", 100 * j, currentDeadline + 15 * rand2 * intensity, 8)
                    break
                case 3:
                    task = task1("getMean", 100 * j, currentDeadline + 1 * rand2 * intensity , 1)
                    break
                
            }
            queue.push(task)
            if (queue.length === numberOfTasks) {
                break
            }
        }
    }
    return queue
}