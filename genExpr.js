// genExpr.js
//   Generate an arithmetic expression.

// Node is an operation in the final expression.
//   Nodes are formed in a tree structure.
//   Traversing the tree from left to right outputs the final expression.

class Node{
  static numNodes=0;  // total number of nodes in tree
  constructor(value,depth,parent,parens) {
    this.op=""; // the operation of this node
    this.value=value;  // this node's final computed value
    this.depth=depth;  // where we are in the tree. root=0
    this.parent=parent;  // parent of this node
    this.parens=parens;  // if this node's final expression is parenthesized.
    this.left=null;  // the left child, either a literal value,
                     //   or a continuation of further expression generation
    this.right=null;
  }
}

maxNodes=12;  // max number of nodes in the tree
maxDepth=3;   // max depth of tree; root=0
ops="+-*/^";
expr="";      // final generated expression

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random()*(max-min+1))+min;
}

function makeNode(value,depth,parent,parens) {
  var node=new Node(value,depth,parent,false);
  node.numNodes+=1;
  if ((Node.numNodes >= maxNodes) || (depth >= maxDepth)) {
    return node;  // just return a literal value node
  } else {
    var op=ops[getRandomIntInclusive(0,1)];
    switch(op) {
      case "+":
        node.op="+";
        var add1=getRandomIntInclusive(1,value);
        var add2=value-add1;
        var nodeLeft=makeNode(add1,depth+1,node,false);
        var nodeRight=makeNode(add2,depth+1,node,false);
        node.left=nodeLeft;
        node.right=nodeRight;
        break;
      case "-":  // parenthesize min and sub to guarantee final value
        node.op="-";
        node.parens=true;
        var minuend=getRandomIntInclusive(value+1,value+1+100);
        var subtrahend=minuend-value;
        var nodeLeft=makeNode(minuend,depth+1,node,true);
        var nodeRight=makeNode(subtrahend,depth+1,node,true);
        node.left=nodeLeft;
        node.right=nodeRight;
        break;
    }
    return node;
  }
}

function printNodes(node) {
  console.log("  ".repeat(node.depth)+"Processing node with op='"+node.op+"' and value='"+node.value+"'");
  if (node.op == "") {  // no op assigned, so literal value
    expr+=node.value;
  } else {
    if (node.parens) {  // if this node wants to be parenthesized, wrap it
      expr=expr+"(";
    }
    printNodes(node.left);
    expr+=node.op;
    printNodes(node.right);
    if (node.parens) {
      expr=expr+")";;
    }
  }
}

// Start tree generation
//   This node is the "center" of the expression.
exprNode=makeNode(getRandomIntInclusive(1,1000),0,null,false);
// console.log(exprNode);
printNodes(exprNode);
console.log(expr);
