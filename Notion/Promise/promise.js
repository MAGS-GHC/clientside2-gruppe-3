let start = Date.now()
let waitTime = 1_000_000_000;
function clear() {
    console.clear()
    start = Date.now()
}
function log(x) {
    console.log(x)
    let end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
}
function burger() {
    clear()
    console.log('🍞 Log 1');

    setTimeout(_ => console.log('🥩 Timeout 2'),0);

    Promise.resolve().then(_ => console.log('🥬 Promise 3'));

    console.log('🍞 Log 4');
}
const countSheepBlocker = () => {
    let i = 0
    let waitTime = 1_000_000_000;
    while(i < waitTime) {i++;}

    return `Nu har ${waitTime} 🐑 hoppet over hegnet` 
}
function AsyncLoop(){
    clear()
    log("Synkron kode 1")

    log(countSheepBlocker())
    
    log("Synkron kode 2")
}

const countSheepBlockerP = () => {
    return new Promise((resolve,reject) => {
        let i = 0
    while(i < waitTime) {i++;}

    resolve( `Nu har ${waitTime} 🐑 hoppet over hegnet` )
    })   
}
function PromiseLoop(){
    clear()
    log(`Synkron kode 1`);
    countSheepBlockerP().then(log)
    log(`Synkron kode 2 `);
}

const countSheepBlockerPS = () => {
    return Promise.resolve().then(v => {
        let i = 0
        while(i < waitTime) {i++;}

        return `Nu har ${waitTime} 🐑 hoppet over hegnet`
    })
    
}
function PromiseResolveLoop(){
    clear()
    log(`Synkron kode 1`);
    countSheepBlockerPS().then(log)
    log(`Synkron kode 2 `);
}
