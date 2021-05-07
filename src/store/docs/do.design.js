import {
    Doc,
    Hardoc
} from './helpers.js'

let doc1 = new Hardoc({ filename:"world.txt", id: 0,type:"Record",path:"hello/"})
console.log(doc1)

let doc2 = new Doc({ title:"Hello my dear world", filename:"world.txt",type:"Record",path:"hello/"})
doc2.setId(2020)
console.log(doc2)


