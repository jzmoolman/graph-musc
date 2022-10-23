console.log('Testing interfaces and dynamic allocaitons')

export type SomeType = 'class1' | 'class2'

interface MyNode  {
    id: number
    someType: SomeType
}

interface CustomNode1 extends MyNode {
    stuff: string
}

interface CustomNode2 extends MyNode {
    stuff: number
}

let customNode1: CustomNode1 = {
    id : 1,
    someType: 'class1', 
    stuff: 'Stuff'
}


let node : MyNode = customNode1

console.log(node)
console.log(typeof node)

if ( node.someType === 'class1' ) {
    console.log((node as CustomNode1).stuff)
}
